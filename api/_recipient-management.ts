import type { AuthenticatedServerContext } from '../src/types/apiServer'
import type { RecipientActionStatus } from '../src/types/recipients'

// Harassment/spam-vedelem: egy owner ennyi FUGGO (meg el nem fogadott/elutasitott/
// visszavont) meghivast tarthat egyszerre EGY recipient fele, sok trip-en at.
const MAX_PENDING_INVITES_PER_RECIPIENT = 20

// True, ha az owner mar eleri a fuggo-meghivas limitet ennel a recipientnel.
// Igy egy owner nem tud sok kulonbozo trippel elarasztani valakit.
export async function isPendingInviteLimitReached(
  ctx: AuthenticatedServerContext,
  ownerId: string,
  recipientUserId: string,
): Promise<boolean> {
  const { count, error } = await ctx.supabase
    .from('trip_share_recipients')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('recipient_user_id', recipientUserId)
    .is('accepted_at', null)
    .is('declined_at', null)
    .is('revoked_at', null)
  if (error) throw error
  return (count ?? 0) >= MAX_PENDING_INVITES_PER_RECIPIENT
}

// Email -> letezo user id feloldas a service-role-only SQL fuggvennyel. Nem ad
// vissza profil adatot, csak az id-t (vagy null). Query hibat tovabb dob.
export async function resolveUserIdByEmail(
  ctx: AuthenticatedServerContext,
  email: string,
): Promise<string | null> {
  const { data, error } = await ctx.supabase.rpc('resolve_user_id_by_email', { p_email: email })
  if (error) throw error
  return typeof data === 'string' ? data : null
}

export async function resolveUserIdByPublicShareId(
  ctx: AuthenticatedServerContext,
  publicShareId: string,
): Promise<string | null> {
  const { data, error } = await ctx.supabase
    .from('profiles')
    .select('id')
    .eq('public_share_id', publicShareId)
    .eq('profile_share_enabled', true)
    .maybeSingle()
  if (error) throw error
  return typeof data?.id === 'string' ? data.id : null
}

// Pending meghivas letrehozasa. A parcialis unique index miatt ha mar van aktiv
// (nem visszavont, nem elutasitott) meghivas -> 23505 -> 'already_invited'
// (determinisztikus). Az owner_id-t a hivo (szerver) allitja be, sosem a kliens.
export async function createPendingInvite(
  ctx: AuthenticatedServerContext,
  tripId: string,
  ownerId: string,
  recipientUserId: string,
  recipientEmail: string | null,
): Promise<RecipientActionStatus> {
  const { error } = await ctx.supabase
    .from('trip_share_recipients')
    .insert({
      trip_id: tripId,
      owner_id: ownerId,
      recipient_user_id: recipientUserId,
      recipient_email: recipientEmail,
    })
  if (error) {
    if (error.code === '23505') return 'already_invited'
    throw error
  }
  return 'invited'
}

// Recipient accept/decline: CSAK a sajat, PENDING meghivasat (accept-gate). A
// scope (recipient_user_id = userId) a recipient auth; a lifecycle-szurok
// biztositjak, hogy visszavont/mar kezelt sor ne legyen ujraaktivalhato.
export async function respondToInvite(
  ctx: AuthenticatedServerContext,
  inviteId: string,
  userId: string,
  action: 'accept' | 'decline',
): Promise<RecipientActionStatus> {
  const nowIso = new Date().toISOString()
  const patch = action === 'accept' ? { accepted_at: nowIso } : { declined_at: nowIso }
  const { data, error } = await ctx.supabase
    .from('trip_share_recipients')
    .update(patch)
    .eq('id', inviteId)
    .eq('recipient_user_id', userId)
    .is('accepted_at', null)
    .is('declined_at', null)
    .is('revoked_at', null)
    .select('id')
    .maybeSingle()
  if (error) throw error
  if (!data) return 'noop'
  return action === 'accept' ? 'accepted' : 'declined'
}

// Owner revoke: CSAK a sajat trip-jehez tartozo, meg nem visszavont meghivast
// (pending VAGY accepted). A scope (owner_id = ownerId) az owner auth.
export async function revokeInvite(
  ctx: AuthenticatedServerContext,
  inviteId: string,
  ownerId: string,
): Promise<RecipientActionStatus> {
  const { data, error } = await ctx.supabase
    .from('trip_share_recipients')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', inviteId)
    .eq('owner_id', ownerId)
    .is('revoked_at', null)
    .select('id')
    .maybeSingle()
  if (error) throw error
  return data ? 'revoked' : 'noop'
}
