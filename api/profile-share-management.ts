import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ProfileShareManagementRequestSchema, ProfileShareManagementResponseSchema } from '../src/schemas/profileShare.js'
import { requireAuthenticatedUser } from './_server-auth.js'
import {
  disableProfileShare,
  enableProfileShare,
  getProfileShare,
  rotateProfileShare,
} from './_profile-share-management.js'

function jsonError(res: VercelResponse, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Nem tamogatott HTTP metodus.')
  }

  const ctx = await requireAuthenticatedUser(req, res)
  if (!ctx) return

  const body = ProfileShareManagementRequestSchema.safeParse(req.body)
  if (!body.success) {
    return jsonError(res, 400, 'INVALID_REQUEST', 'Hibas profil QR keres.')
  }

  try {
    const profileShare = body.data.action === 'get'
      ? await getProfileShare(ctx, ctx.user.id)
      : body.data.action === 'enable'
        ? await enableProfileShare(ctx, ctx.user.id)
        : body.data.action === 'rotate'
          ? await rotateProfileShare(ctx, ctx.user.id)
          : await disableProfileShare(ctx, ctx.user.id)

    const parsed = ProfileShareManagementResponseSchema.safeParse({ ok: true, profileShare })
    if (!parsed.success) {
      console.error('[profile-share-management] response validation failed')
      return jsonError(res, 500, 'INVALID_RESPONSE', 'Nem sikerult ervenyes valaszt osszeallitani.')
    }
    return res.status(200).json(parsed.data)
  } catch (err) {
    console.error('[profile-share-management] failed', {
      action: body.data.action,
      message: err instanceof Error ? err.message : 'unknown',
    })
    return jsonError(res, 500, 'PROFILE_SHARE_FAILED', 'A profil QR muvelet nem sikerult.')
  }
}
