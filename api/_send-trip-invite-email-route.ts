import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SendTripInviteEmailRequestSchema, SendTripInviteEmailResponseSchema } from '../src/schemas/emailInvites.js'
import { requireAuthenticatedUser } from './_server-auth.js'
import {
  enforceInviteEmailRateLimit,
  ensurePublicShareUrl,
  getEmailConfig,
  recordInviteEmailSent,
  resolveOwnedTripInviteContext,
  sendInviteEmail,
} from './_trip-invite-email.js'
import {
  createPendingInvite,
  isPendingInviteLimitReached,
  resolveUserIdByEmail,
} from './_recipient-management.js'

function jsonError(res: VercelResponse, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

function jsonOk(res: VercelResponse, status: 'sent' | 'duplicate') {
  const parsed = SendTripInviteEmailResponseSchema.safeParse({ ok: true, status })
  if (!parsed.success) {
    console.error('[send-trip-invite-email] response validation failed')
    return jsonError(res, 500, 'INVALID_RESPONSE', 'Nem sikerult ervenyes valaszt osszeallitani.')
  }
  return res.status(200).json(parsed.data)
}

function logPostSendFailure(step: 'audit' | 'account_invite', err: unknown) {
  console.error('[send-trip-invite-email] post-send step failed', {
    step,
    message: err instanceof Error ? err.message : 'unknown',
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Nem tamogatott HTTP metodus.')
  }

  const ctx = await requireAuthenticatedUser(req, res)
  if (!ctx) return

  const body = SendTripInviteEmailRequestSchema.safeParse(req.body)
  if (!body.success) {
    return jsonError(res, 400, 'INVALID_REQUEST', 'Hibas email meghivo keres.')
  }

  const recipientEmail = body.data.recipientEmail.toLowerCase()

  try {
    const trip = await resolveOwnedTripInviteContext(ctx, body.data.slug)
    if (!trip) {
      return jsonError(res, 404, 'TRIP_NOT_FOUND', 'Az utazas nem talalhato vagy nincs jogosultsagod megosztani.')
    }

    const config = getEmailConfig()
    if (!config) {
      return jsonError(res, 500, 'EMAIL_PROVIDER_NOT_CONFIGURED', 'Az email kuldes nincs konfiguralva.')
    }

    const rate = await enforceInviteEmailRateLimit(ctx, ctx.user.id, trip.tripId, recipientEmail)
    if (rate === 'duplicate') {
      return jsonOk(res, 'duplicate')
    }
    if (rate === 'rate_limited') {
      return jsonError(res, 429, 'EMAIL_RATE_LIMITED', 'Tul sok email meghivo. Probald ujra kesobb.')
    }

    const share = await ensurePublicShareUrl(ctx, trip.tripId, config.appUrl)
    if (!share.ok) {
      return jsonError(res, share.status, share.code, share.message)
    }

    const recipientUserId = await resolveUserIdByEmail(ctx, recipientEmail)

    try {
      await sendInviteEmail(config, {
        to: recipientEmail,
        ownerEmail: ctx.user.email ?? null,
        tripTitle: trip.title,
        tripSubtitle: trip.subtitle,
        shareUrl: share.shareUrl,
      })
    } catch (sendError) {
      try {
        await recordInviteEmailSent(ctx, ctx.user.id, trip.tripId, recipientEmail, 'provider_failed')
      } catch (auditError) {
        logPostSendFailure('audit', auditError)
      }
      throw sendError
    }

    try {
      await recordInviteEmailSent(ctx, ctx.user.id, trip.tripId, recipientEmail, 'sent')
    } catch (auditError) {
      logPostSendFailure('audit', auditError)
    }

    if (recipientUserId && recipientUserId !== ctx.user.id) {
      try {
        if (!(await isPendingInviteLimitReached(ctx, ctx.user.id, recipientUserId))) {
          await createPendingInvite(ctx, trip.tripId, ctx.user.id, recipientUserId, recipientEmail)
        }
      } catch (inviteError) {
        logPostSendFailure('account_invite', inviteError)
      }
    }

    return jsonOk(res, 'sent')
  } catch (err) {
    console.error('[send-trip-invite-email] failed', {
      message: err instanceof Error ? err.message : 'unknown',
    })
    return jsonError(res, 500, 'EMAIL_INVITE_FAILED', 'Az email meghivo kuldese nem sikerult.')
  }
}
