import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CreateTripShareRequestSchema, CreateTripShareResponseSchema } from '../src/schemas/sharing.js'
import { requireAuthenticatedUser } from './_server-auth.js'
import { createRawShareToken, hashShareToken } from './_share-token.js'

const MIN_EXPIRY_OFFSET_MS = 5000

function jsonError(res: VercelResponse, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Nem tamogatott HTTP metodus.')
  }

  const ctx = await requireAuthenticatedUser(req, res)
  if (!ctx) return

  const body = CreateTripShareRequestSchema.safeParse(req.body)
  if (!body.success) {
    return jsonError(res, 400, 'INVALID_REQUEST', 'Hibas share letrehozasi keres.')
  }

  const { tripId, expiresAt } = body.data
  const expiresAtValue = expiresAt ?? null
  if (
    expiresAtValue &&
    new Date(expiresAtValue).getTime() <= Date.now() + MIN_EXPIRY_OFFSET_MS
  ) {
    return jsonError(res, 400, 'INVALID_EXPIRY', 'A lejarati ido csak jovobeli idopont lehet.')
  }

  const { data: trip, error: tripError } = await ctx.supabase
    .from('trips')
    .select('id')
    .eq('id', tripId)
    .eq('owner_id', ctx.user.id)
    .maybeSingle()

  if (tripError) {
    console.error('[create-trip-share] owner check failed', { code: tripError.code })
    return jsonError(res, 500, 'OWNER_CHECK_FAILED', 'Nem sikerult ellenorizni az utazas tulajdonosat.')
  }

  if (!trip) {
    return jsonError(res, 404, 'TRIP_NOT_FOUND', 'Az utazas nem talalhato vagy nincs jogosultsagod megosztani.')
  }

  const nowIso = new Date().toISOString()
  const { error: revokeExpiredError } = await ctx.supabase
    .from('trip_shares')
    .update({ revoked_at: nowIso })
    .eq('trip_id', tripId)
    .is('revoked_at', null)
    .lt('expires_at', nowIso)

  if (revokeExpiredError) {
    console.error('[create-trip-share] expired share cleanup failed', { code: revokeExpiredError.code })
    return jsonError(res, 500, 'SHARE_CLEANUP_FAILED', 'Nem sikerult ellenorizni a lejart megosztasokat.')
  }

  const { data: activeShare, error: activeShareError } = await ctx.supabase
    .from('trip_shares')
    .select('id')
    .eq('trip_id', tripId)
    .is('revoked_at', null)
    .limit(1)
    .maybeSingle()

  if (activeShareError) {
    console.error('[create-trip-share] active share lookup failed', { code: activeShareError.code })
    return jsonError(res, 500, 'SHARE_LOOKUP_FAILED', 'Nem sikerult ellenorizni az aktiv megosztast.')
  }

  if (activeShare) {
    return jsonError(res, 409, 'ACTIVE_SHARE_EXISTS', 'Ehhez az utazashoz mar van aktiv megosztasi link.')
  }

  const rawToken = createRawShareToken()
  const tokenHash = hashShareToken(rawToken)
  const { data: share, error: insertError } = await ctx.supabase
    .from('trip_shares')
    .insert({
      trip_id: tripId,
      token_hash: tokenHash,
      created_by: ctx.user.id,
      expires_at: expiresAtValue,
    })
    .select('id, trip_id, created_at, expires_at')
    .single()

  if (insertError || !share) {
    console.error('[create-trip-share] insert failed', { code: insertError?.code })
    if (insertError?.code === '23505') {
      return jsonError(res, 409, 'ACTIVE_SHARE_EXISTS', 'Ehhez az utazashoz mar van aktiv megosztasi link.')
    }
    if (insertError?.code === '23514') {
      return jsonError(res, 400, 'INVALID_EXPIRY', 'A lejarati ido csak jovobeli idopont lehet.')
    }
    return jsonError(res, 500, 'SHARE_CREATE_FAILED', 'Nem sikerult letrehozni a megosztasi linket.')
  }

  const response = CreateTripShareResponseSchema.safeParse({
    ok: true,
    share: {
      id: share.id,
      tripId: share.trip_id,
      token: rawToken,
      createdAt: share.created_at,
      expiresAt: share.expires_at,
    },
  })

  if (!response.success) {
    console.error('[create-trip-share] response validation failed')
    await ctx.supabase
      .from('trip_shares')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', share.id)
    return jsonError(res, 500, 'INVALID_SHARE_RESPONSE', 'Nem sikerult ervenyes megosztasi valaszt osszeallitani.')
  }

  return res.status(201).json(response.data)
}
