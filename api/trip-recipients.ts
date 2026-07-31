import type { VercelRequest, VercelResponse } from '@vercel/node'
import { RecipientRequestSchema, RecipientResponseSchema } from '../src/schemas/recipients.js'
import { requireAuthenticatedUser } from './_server-auth.js'
import { resolveOwnedTripId } from './_share-management.js'
import {
  resolveUserIdByEmail,
  resolveUserIdByPublicShareId,
  createPendingInvite,
  respondToInvite,
  revokeInvite,
  isPendingInviteLimitReached,
} from './_recipient-management.js'
import type { RecipientActionStatus } from '../src/types/recipients'

function jsonError(res: VercelResponse, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

function sendStatus(res: VercelResponse, status: RecipientActionStatus) {
  const parsed = RecipientResponseSchema.safeParse({ ok: true, status })
  if (!parsed.success) {
    console.error('[trip-recipients] response validation failed')
    return jsonError(res, 500, 'INVALID_RESPONSE', 'Nem sikerult ervenyes valaszt osszeallitani.')
  }
  return res.status(200).json(parsed.data)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Nem tamogatott HTTP metodus.')
  }

  const ctx = await requireAuthenticatedUser(req, res)
  if (!ctx) return

  const body = RecipientRequestSchema.safeParse(req.body)
  if (!body.success) {
    return jsonError(res, 400, 'INVALID_REQUEST', 'Hibas recipient keres.')
  }
  const data = body.data

  try {
    if (data.action === 'invite') {
      // Owner auth: csak a sajat trip-jehez hivhat meg.
      const tripId = await resolveOwnedTripId(ctx, data.slug)
      if (!tripId) {
        return jsonError(res, 404, 'TRIP_NOT_FOUND', 'Az utazas nem talalhato vagy nincs jogosultsagod megosztani.')
      }
      const recipientEmail = 'recipientEmail' in data ? data.recipientEmail : null
      const recipientUserId = 'recipientEmail' in data
        ? await resolveUserIdByEmail(ctx, data.recipientEmail)
        : await resolveUserIdByPublicShareId(ctx, data.publicShareId)
      if (!recipientUserId) return sendStatus(res, 'not_app_user')
      if (recipientUserId === ctx.user.id) return sendStatus(res, 'self')
      // Spam-vedelem: sok trip-en at tul sok fuggo meghivas ugyanannak a usernek.
      if (await isPendingInviteLimitReached(ctx, ctx.user.id, recipientUserId)) {
        return sendStatus(res, 'invite_limit')
      }
      return sendStatus(res, await createPendingInvite(ctx, tripId, ctx.user.id, recipientUserId, recipientEmail))
    }

    if (data.action === 'accept' || data.action === 'decline') {
      // Recipient auth: a scope (recipient_user_id = ctx.user.id) a helperben.
      return sendStatus(res, await respondToInvite(ctx, data.inviteId, ctx.user.id, data.action))
    }

    // revoke — owner auth: a scope (owner_id = ctx.user.id) a helperben.
    return sendStatus(res, await revokeInvite(ctx, data.inviteId, ctx.user.id))
  } catch (err) {
    console.error('[trip-recipients] failed', {
      action: data.action,
      message: err instanceof Error ? err.message : 'unknown',
    })
    return jsonError(res, 500, 'RECIPIENT_ACTION_FAILED', 'A muvelet nem sikerult.')
  }
}
