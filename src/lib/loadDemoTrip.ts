import { TripSchema } from '@/schemas/trip'
import { projectPublicTrip } from '@/schemas/sharing'
import type { PublicTrip } from '@/types/api'

// A demo utazas statikus repo-adat, de ugyanugy KULSO boundary-nak szamit, mint
// barmely mas JSON: unknown-kent indul, TripSchema-val validalodik, es a publikus
// nezetbe csak a projectPublicTrip whitelist projekcion at jut ki. Igy a demo
// sosem tud olyan mezot megjeleniteni, amit a valodi megosztas visszatartana.
// Lasd: docs/architecture/DEMO_TRIP_STRATEGY.md
//
// A dinamikus import miatt a JSON sajat chunkba kerul, nem terheli az initial
// payloadot.
export async function loadDemoTrip(): Promise<PublicTrip | null> {
  const module: { default: unknown } = await import('@/data/demo/demo-trip.json')
  const parsed = TripSchema.safeParse(module.default)
  if (!parsed.success) return null
  return projectPublicTrip(parsed.data)
}
