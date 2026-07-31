import type { VercelRequest, VercelResponse } from '@vercel/node'
import { TripShareManagementRequestSchema, TripShareManagementResponseSchema } from '../src/schemas/sharing.js'
import { requireAuthenticatedUser } from './_server-auth.js'
import { decryptShareToken } from './_share-crypto.js'
import {
  resolveOwnedTripId,
  loadActiveShare,
  revokeExpiredShares,
  revokeActiveShares,
  buildShareToken,
  insertShareRow,
} from './_share-management.js'
import type { ActiveShareRow, CreateShareOutcome } from '../src/types/shareServer'
import type { ManagedShare } from '../src/types/api'

const MIN_EXPIRY_OFFSET_MS = 5000

function jsonError(res: VercelResponse, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

function sendShare(res: VercelResponse, share: ManagedShare | null, revoked?: boolean) {
  const payload = revoked === undefined ? { ok: true, share } : { ok: true, share, revoked }
  const parsed = TripShareManagementResponseSchema.safeParse(payload)
  if (!parsed.success) {
    console.error('[trip-share-management] response validation failed')
    return jsonError(res, 500, 'INVALID_RESPONSE', 'Nem sikerult ervenyes valaszt osszeallitani.')
  }
  return res.status(200).json(parsed.data)
}

// A dekodolas KIZAROLAG itt, owner-hitelesitett kod moge zarva tortenik. Legacy
// (ciphertext nelkuli) vagy dekodolasi hiba eseten token = null (nem re-displayelheto).
function decryptForOwner(active: ActiveShareRow): string | null {
  if (!active.token_ciphertext) return null
  try {
    return decryptShareToken(active.token_ciphertext, active.token_key_version)
  } catch (decryptError) {
    console.error('[trip-share-management] token decrypt failed', {
      message: decryptError instanceof Error ? decryptError.message : 'unknown',
    })
    return null
  }
}

function invalidExpiry(expiresAtValue: string | null): boolean {
  return !!expiresAtValue && new Date(expiresAtValue).getTime() <= Date.now() + MIN_EXPIRY_OFFSET_MS
}

function respondCreated(res: VercelResponse, outcome: CreateShareOutcome) {
  if (!outcome.ok) return jsonError(res, outcome.status, outcome.code, outcome.message)
  return sendShare(res, {
    id: outcome.id,
    token: outcome.token,
    createdAt: outcome.createdAt,
    expiresAt: outcome.expiresAt,
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Nem tamogatott HTTP metodus.')
  }

  const ctx = await requireAuthenticatedUser(req, res)
  if (!ctx) return

  const body = TripShareManagementRequestSchema.safeParse(req.body)
  if (!body.success) {
    return jsonError(res, 400, 'INVALID_REQUEST', 'Hibas megosztas-kezelesi keres.')
  }
  const { slug, action, expiresAt } = body.data
  const expiresAtValue = expiresAt ?? null

  try {
    const tripId = await resolveOwnedTripId(ctx, slug)
    if (!tripId) {
      return jsonError(res, 404, 'TRIP_NOT_FOUND', 'Az utazas nem talalhato vagy nincs jogosultsagod megosztani.')
    }

    if (action === 'get') {
      const active = await loadActiveShare(ctx, tripId)
      if (!active) return sendShare(res, null)
      return sendShare(res, {
        id: active.id,
        token: decryptForOwner(active),
        createdAt: active.created_at,
        expiresAt: active.expires_at,
      })
    }

    if (action === 'revoke') {
      const revoked = await revokeActiveShares(ctx, tripId)
      return sendShare(res, null, revoked)
    }

    // create / regenerate
    if (invalidExpiry(expiresAtValue)) {
      return jsonError(res, 400, 'INVALID_EXPIRY', 'A lejarati ido csak jovobeli idopont lehet.')
    }

    if (action === 'create') {
      await revokeExpiredShares(ctx, tripId)
      const active = await loadActiveShare(ctx, tripId)
      if (active) {
        return jsonError(res, 409, 'ACTIVE_SHARE_EXISTS', 'Ehhez az utazashoz mar van aktiv megosztasi link.')
      }
      const built = buildShareToken()
      if (!built.ok) return jsonError(res, built.status, built.code, built.message)
      return respondCreated(res, await insertShareRow(ctx, tripId, built.prepared, expiresAtValue))
    }

    // regenerate: titkositasi PREFLIGHT a regi link visszavonasa ELOTT, hogy
    // titkositasi/env hibanal ne vesszen el a mukodo regi link.
    const built = buildShareToken()
    if (!built.ok) return jsonError(res, built.status, built.code, built.message)
    await revokeActiveShares(ctx, tripId)
    return respondCreated(res, await insertShareRow(ctx, tripId, built.prepared, expiresAtValue))
  } catch (err) {
    console.error('[trip-share-management] failed', {
      action,
      message: err instanceof Error ? err.message : 'unknown',
    })
    return jsonError(res, 500, 'SHARE_MANAGEMENT_FAILED', 'A megosztas kezelese sikertelen.')
  }
}
