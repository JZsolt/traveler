import type { AuthenticatedServerContext } from '../src/types/apiServer'
import type { SharedWithMeTrip, PendingInvite } from '../src/types/api'
import { TripSchema } from '../src/schemas/trip.js'
import { projectPublicTrip } from '../src/schemas/sharing.js'

// A recipient shared-with-me nezete: elfogadott trip-ek PublicTrip-kent, fuggo
// meghivasok minimal teaser-kent. A nyers trip_data SOHA nem hagyja el a szervert
// validalatlanul/projektalatlanul: TripSchema boundary -> projectPublicTrip.
export async function buildSharedWithMe(
  ctx: AuthenticatedServerContext,
  userId: string,
): Promise<{ sharedTrips: SharedWithMeTrip[]; pendingInvites: PendingInvite[]; unavailableCount: number }> {
  // Csak a nem elutasitott ES nem visszavont recipient sorok. Az accepted_at
  // donti el, hogy elfogadott (teljes projekcio) vagy fuggo (teaser).
  const { data: rows, error } = await ctx.supabase
    .from('trip_share_recipients')
    .select('id, trip_id, accepted_at')
    .eq('recipient_user_id', userId)
    .is('declined_at', null)
    .is('revoked_at', null)
  if (error) throw error

  const accepted: { inviteId: string; tripId: string }[] = []
  const pending: { inviteId: string; tripId: string }[] = []
  for (const row of rows ?? []) {
    if (row.accepted_at) accepted.push({ inviteId: row.id, tripId: row.trip_id })
    else pending.push({ inviteId: row.id, tripId: row.trip_id })
  }

  const allIds = [...new Set([...accepted.map((a) => a.tripId), ...pending.map((p) => p.tripId)])]
  if (allIds.length === 0) return { sharedTrips: [], pendingInvites: [], unavailableCount: 0 }

  const { data: tripRows, error: tripError } = await ctx.supabase
    .from('trips')
    .select('id, trip_data')
    .in('id', allIds)
  if (tripError) throw tripError

  const tripDataById = new Map<string, unknown>()
  for (const trip of tripRows ?? []) tripDataById.set(trip.id, trip.trip_data)

  // Ervenytelen/hianyzo trip_data-t NEM ejtunk el nemitve: strukturaltan logolunk
  // (trip id, nyers adat nelkul) es szamoljuk, hogy a dashboard jelezhesse.
  let unavailableCount = 0

  const sharedTrips: SharedWithMeTrip[] = []
  for (const { inviteId, tripId } of accepted) {
    const parsed = TripSchema.safeParse(tripDataById.get(tripId))
    if (parsed.success) {
      sharedTrips.push({ inviteId, trip: projectPublicTrip(parsed.data) })
    } else {
      unavailableCount++
      console.warn('[shared-with-me] accepted trip has invalid/missing trip_data', { tripId })
    }
  }

  const pendingInvites: PendingInvite[] = []
  for (const { inviteId, tripId } of pending) {
    const parsed = TripSchema.safeParse(tripDataById.get(tripId))
    if (parsed.success) {
      const trip = parsed.data
      pendingInvites.push({
        inviteId,
        title: trip.title,
        emoji: trip.emoji,
        subtitle: trip.subtitle,
        destination: trip.destination,
      })
    } else {
      unavailableCount++
      console.warn('[shared-with-me] pending invite has invalid/missing trip_data', { inviteId, tripId })
    }
  }

  return { sharedTrips, pendingInvites, unavailableCount }
}
