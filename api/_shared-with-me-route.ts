import type { ApiRequest, ApiResponse } from '../src/types/http'
import { SharedWithMeResponseSchema } from '../src/schemas/sharing.js'
import { requireAuthenticatedUser } from './_server-auth.js'
import { buildSharedWithMe } from './_shared-with-me.js'

function jsonError(res: ApiResponse, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

// Authenticated recipient nezet. A valasz KIZAROLAG PublicTrip projekcio (elfogadott)
// + minimal teaser (fuggo) — nyers trips sor sosem jut a bongeszobe.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Nem tamogatott HTTP metodus.')
  }

  const ctx = await requireAuthenticatedUser(req, res)
  if (!ctx) return

  try {
    const { sharedTrips, pendingInvites, unavailableCount } = await buildSharedWithMe(ctx, ctx.user.id)
    const parsed = SharedWithMeResponseSchema.safeParse({ ok: true, sharedTrips, pendingInvites, unavailableCount })
    if (!parsed.success) {
      console.error('[shared-with-me] response validation failed')
      return jsonError(res, 500, 'INVALID_RESPONSE', 'Nem sikerult ervenyes valaszt osszeallitani.')
    }
    return res.status(200).json(parsed.data)
  } catch (err) {
    console.error('[shared-with-me] failed', {
      message: err instanceof Error ? err.message : 'unknown',
    })
    return jsonError(res, 500, 'SHARED_WITH_ME_FAILED', 'Nem sikerult betolteni a megosztott utazasokat.')
  }
}
