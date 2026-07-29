import { z } from 'zod'
import {
  TripSchema,
  DaySchema,
  ScheduleItemSchema,
  GuideSchema,
  AccommodationSchema,
} from './trip.js'
import type { Trip } from '../types/trip'

export const CreateTripShareRequestSchema = z.object({
  tripId: z.string().uuid(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
})

export const CreateTripShareResponseSchema = z.object({
  ok: z.literal(true),
  share: z.object({
    id: z.string().uuid(),
    tripId: z.string().uuid(),
    token: z.string().min(32),
    createdAt: z.string().datetime({ offset: true }),
    expiresAt: z.string().datetime({ offset: true }).nullable(),
  }),
})

// --- Public trip projection ---
//
// A megosztott (anonim tokennel elerheto) trip publikus alakja. WHITELIST
// megkozelites: csak az itt kifejezetten felsorolt mezok kerulnek ki. Igy
// barmilyen JOVOBELI uj Trip mezo alapertelmezetten KIMARAD, amig valaki
// tudatosan hozza nem adja a whitelisthez (safe-by-default).
//
// Szandekosan kizarva (nem szerepel a picklistaban):
//   - days[].tickets  -> jegyek, a tulajdonosnal vannak, nem kell megosztani
//   - insurance       -> feltoltott PDF dokumentumok (szemelyes)
//   - status, aiModel, expandedDays, days[]._draft -> belso/szerkesztesi allapot
//
// A top-level whitelist onmagaban NEM eleg: a Trip-ben ket .passthrough() sema
// van (AccommodationSchema, GuideSchema), amelyek nyersen atvinnek barmilyen
// extra/jovobeli nested kulcsot (pl. accommodation.privateNote). Ezert ezeket
// explicit .strip()-elt public sema valtozattal helyettesitjuk, hogy a nested
// ismeretlen mezok is alapertelmezetten kimaradjanak (safe-by-default).
export const PublicGuideSchema = GuideSchema.strip()

export const PublicScheduleItemSchema = ScheduleItemSchema.extend({
  guide: PublicGuideSchema.optional(),
})

export const PublicAccommodationSchema = AccommodationSchema.strip()

export const PublicDaySchema = DaySchema.pick({
  dayNum: true,
  title: true,
  subtitle: true,
  alerts: true,
  endAlerts: true,
  images: true,
  transportOptions: true,
  costs: true,
}).extend({
  schedule: z.array(PublicScheduleItemSchema),
})

export const PublicTripSchema = TripSchema.pick({
  slug: true,
  title: true,
  subtitle: true,
  emoji: true,
  startDate: true,
  endDate: true,
  people: true,
  destination: true,
  highlights: true,
  flight: true,
  budget: true,
  urgentBookings: true,
  usefulLinks: true,
  packingList: true,
  savingTips: true,
  savingTipsLabel: true,
  practicalInfo: true,
  bookingChecklist: true,
  overview: true,
}).extend({
  accommodation: PublicAccommodationSchema,
  days: z.array(PublicDaySchema),
})

// A projekcio a whitelist seman valo parse-olassal keszul: a Zod object
// alapertelmezes szerint eldobja a nem whitelistelt kulcsokat, igy a tickets,
// insurance es a belso mezok automatikusan kimaradnak. Bemenetkent mar
// TripSchema-val validalt Trip-et var (a hivo boundary-n tortent a validacio).
export function projectPublicTrip(trip: Trip): z.infer<typeof PublicTripSchema> {
  return PublicTripSchema.parse(trip)
}

// --- Public shared-trip lookup (anonim, token alapjan) ---

export const SharedTripRequestSchema = z.object({
  token: z.string().min(32).max(200),
})

export const PublicSharedTripResponseSchema = z.object({
  ok: z.literal(true),
  trip: PublicTripSchema,
})

// --- Owner-oldali share menedzsment (kliens boundary) ---
// Az owner sajat (RLS-vedett) trip_shares soraibol CSAK metaadat jon vissza —
// a nyers token soha (az kizarolag hash-kent letezik az adatbazisban).
export const ActiveShareSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime({ offset: true }),
  expires_at: z.string().datetime({ offset: true }).nullable(),
})

// A "megosztott?" badge query eredmenye: trip_shares join a trips.slug-ra.
export const SharedSlugRowSchema = z.object({
  trips: z.object({ slug: z.string() }),
})
