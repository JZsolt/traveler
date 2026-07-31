import type { AuthenticatedServerContext } from '../src/types/apiServer'
import type {
  EmailProviderPayload,
  TripInviteEmailEventInsert,
} from '../src/types/emailInviteServer'
import type {
  TripInviteEmailConfig,
  TripInviteEmailContext,
  TripInviteEmailSendParams,
  PublicShareUrlOutcome,
} from '../src/types/emailInvites'
import { TripSchema } from '../src/schemas/trip.js'
import { decryptShareToken } from './_share-crypto.js'
import { buildShareToken, insertShareRow, loadActiveShare } from './_share-management.js'

const OWNER_HOURLY_LIMIT = 10
const TRIP_DAILY_LIMIT = 20
const DUPLICATE_WINDOW_MS = 15 * 60 * 1000
const OWNER_WINDOW_MS = 60 * 60 * 1000
const TRIP_WINDOW_MS = 24 * 60 * 60 * 1000

export function getEmailConfig(): TripInviteEmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.INVITE_EMAIL_FROM
  const appUrl = process.env.APP_PUBLIC_URL
  if (!apiKey || !from || !appUrl) return null
  return { apiKey, from, appUrl }
}

export async function resolveOwnedTripInviteContext(
  ctx: AuthenticatedServerContext,
  slug: string,
): Promise<TripInviteEmailContext | null> {
  const { data, error } = await ctx.supabase
    .from('trips')
    .select('id, trip_data')
    .eq('slug', slug)
    .eq('owner_id', ctx.user.id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const parsed = TripSchema.safeParse(data.trip_data)
  if (!parsed.success) throw new Error('INVALID_TRIP_DATA')
  return {
    tripId: data.id,
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
  }
}

async function recordEmailEvent(
  ctx: AuthenticatedServerContext,
  event: TripInviteEmailEventInsert,
): Promise<void> {
  const { error } = await ctx.supabase
    .from('trip_invite_email_events')
    .insert(event)
  if (error) throw error
}

async function hasRecentDuplicate(
  ctx: AuthenticatedServerContext,
  tripId: string,
  recipientEmail: string,
): Promise<boolean> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString()
  const { data, error } = await ctx.supabase
    .from('trip_invite_email_events')
    .select('id')
    .eq('trip_id', tripId)
    .eq('recipient_email', recipientEmail)
    .gte('created_at', since)
    .in('status', ['sent', 'duplicate'])
    .maybeSingle()
  if (error) throw error
  return !!data
}

async function countRecent(
  ctx: AuthenticatedServerContext,
  column: 'owner_id' | 'trip_id',
  id: string,
  windowMs: number,
): Promise<number> {
  const since = new Date(Date.now() - windowMs).toISOString()
  const { count, error } = await ctx.supabase
    .from('trip_invite_email_events')
    .select('id', { count: 'exact', head: true })
    .eq(column, id)
    .gte('created_at', since)
    .in('status', ['sent', 'provider_failed'])
  if (error) throw error
  return count ?? 0
}

export async function enforceInviteEmailRateLimit(
  ctx: AuthenticatedServerContext,
  ownerId: string,
  tripId: string,
  recipientEmail: string,
): Promise<'ok' | 'duplicate' | 'rate_limited'> {
  if (await hasRecentDuplicate(ctx, tripId, recipientEmail)) return 'duplicate'

  const ownerCount = await countRecent(ctx, 'owner_id', ownerId, OWNER_WINDOW_MS)
  if (ownerCount >= OWNER_HOURLY_LIMIT) return 'rate_limited'

  const tripCount = await countRecent(ctx, 'trip_id', tripId, TRIP_WINDOW_MS)
  if (tripCount >= TRIP_DAILY_LIMIT) return 'rate_limited'

  return 'ok'
}

export async function ensurePublicShareUrl(
  ctx: AuthenticatedServerContext,
  tripId: string,
  appUrl: string,
): Promise<PublicShareUrlOutcome> {
  const active = await loadActiveShare(ctx, tripId)
  if (active) {
    if (!active.token_ciphertext) {
      return {
        ok: false,
        status: 409,
        code: 'SHARE_LINK_NOT_DISPLAYABLE',
        message: 'Az aktiv megosztasi link regi formatumu. Generalj uj linket email kuldes elott.',
      }
    }
    const token = decryptShareToken(active.token_ciphertext, active.token_key_version)
    return { ok: true, shareUrl: `${appUrl}/share/${token}` }
  }

  const built = buildShareToken()
  if (!built.ok) return built
  const inserted = await insertShareRow(ctx, tripId, built.prepared, null)
  if (!inserted.ok) return inserted
  return { ok: true, shareUrl: `${appUrl}/share/${inserted.token}` }
}

function emailPayload(config: TripInviteEmailConfig, params: TripInviteEmailSendParams): EmailProviderPayload {
  const owner = params.ownerEmail ? ` (${params.ownerEmail})` : ''
  const subject = `Utazasi meghivo: ${params.tripTitle}`
  const text = [
    `Meghivot kaptal egy utitervhez: ${params.tripTitle}`,
    params.tripSubtitle,
    `Kuldo: Az Utazasaim${owner}`,
    `Megnyitas: ${params.shareUrl}`,
    'Ez egy csak olvashato public link. Ha van fiokod, a meghivas elfogadas utan a Megosztva velem listaban is megjelenhet.',
  ].filter(Boolean).join('\n\n')
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.5;">
      <h1>${escapeHtml(params.tripTitle)}</h1>
      <p>${escapeHtml(params.tripSubtitle)}</p>
      <p>Kuldo: Az Utazasaim${escapeHtml(owner)}</p>
      <p><a href="${escapeHtml(params.shareUrl)}">Utiterv megnyitasa</a></p>
      <p style="color: #666; font-size: 13px;">Ez egy csak olvashato public link. Ha van fiokod, a meghivas elfogadas utan a Megosztva velem listaban is megjelenhet.</p>
    </div>
  `
  return { from: config.from, to: [params.to], subject, text, html }
}

function escapeHtml(value: string): string {
  return value
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#39;')
}

export async function sendInviteEmail(
  config: TripInviteEmailConfig,
  params: TripInviteEmailSendParams,
): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailPayload(config, params)),
  })
  if (!response.ok) throw new Error(`RESEND_${response.status}`)
}

export async function recordInviteEmailSent(
  ctx: AuthenticatedServerContext,
  ownerId: string,
  tripId: string,
  recipientEmail: string,
  status: 'sent' | 'duplicate' | 'rate_limited' | 'provider_failed',
): Promise<void> {
  await recordEmailEvent(ctx, {
    owner_id: ownerId,
    trip_id: tripId,
    recipient_email: recipientEmail,
    status,
  })
}
