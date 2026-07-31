import { describe, expect, it } from 'vitest'
import {
  TripShareManagementRequestSchema,
  TripShareManagementResponseSchema,
  PublicTripSchema,
  projectPublicTrip,
  SharedTripRequestSchema,
  PublicSharedTripResponseSchema,
  SharedWithMeResponseSchema,
} from '../sharing'
import { TripSchema } from '../trip'
import type { Trip } from '@/types/trip'

const SHARE_ID = '550e8400-e29b-41d4-a716-446655440001'
const TOKEN = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

describe('TripShareManagementRequestSchema', () => {
  it('accepts a slug + action, with optional expiry', () => {
    expect(TripShareManagementRequestSchema.safeParse({ slug: 'roma-2026', action: 'get' }).success).toBe(true)
    expect(TripShareManagementRequestSchema.safeParse({
      slug: 'roma-2026',
      action: 'create',
      expiresAt: '2026-08-01T12:00:00.000Z',
    }).success).toBe(true)
  })

  it('rejects an unknown action, empty slug, or bad datetime', () => {
    expect(TripShareManagementRequestSchema.safeParse({ slug: 'x', action: 'delete' }).success).toBe(false)
    expect(TripShareManagementRequestSchema.safeParse({ slug: '', action: 'get' }).success).toBe(false)
    expect(TripShareManagementRequestSchema.safeParse({ slug: 'x', action: 'create', expiresAt: '2026-08-01' }).success).toBe(false)
  })
})

describe('TripShareManagementResponseSchema', () => {
  it('accepts an active re-displayable share (token present)', () => {
    const result = TripShareManagementResponseSchema.safeParse({
      ok: true,
      share: { id: SHARE_ID, token: TOKEN, createdAt: '2026-07-29T12:00:00+00:00', expiresAt: null },
    })
    expect(result.success).toBe(true)
  })

  it('accepts a legacy active share with null token (not re-displayable)', () => {
    const result = TripShareManagementResponseSchema.safeParse({
      ok: true,
      share: { id: SHARE_ID, token: null, createdAt: '2026-07-29T12:00:00+00:00', expiresAt: null },
    })
    expect(result.success).toBe(true)
  })

  it('accepts a revoke result (share null + revoked flag)', () => {
    const result = TripShareManagementResponseSchema.safeParse({ ok: true, share: null, revoked: true })
    expect(result.success).toBe(true)
  })

  it('strips DB internals and never exposes token_hash', () => {
    const result = TripShareManagementResponseSchema.safeParse({
      ok: true,
      share: {
        id: SHARE_ID,
        token: TOKEN,
        createdAt: '2026-07-29T12:00:00+00:00',
        expiresAt: null,
        token_hash: 'deadbeef',
        token_ciphertext: 'iv.tag.data',
        ownerId: '550e8400-e29b-41d4-a716-446655440002',
      },
    })
    expect(result.success).toBe(true)
    if (result.success && result.data.share) {
      expect('token_hash' in result.data.share).toBe(false)
      expect('token_ciphertext' in result.data.share).toBe(false)
      expect('ownerId' in result.data.share).toBe(false)
    }
  })
})

function makeTrip(): Trip {
  return TripSchema.parse({
    slug: 'roma-2026',
    title: 'Roma',
    subtitle: 'Varosnezes',
    emoji: '🇮🇹',
    startDate: '2026-10-15',
    endDate: '2026-10-19',
    people: '4 felnott',
    destination: 'Roma',
    highlights: ['Colosseum'],
    accommodation: {
      address: 'Via Roma 1',
      doorCode: '1234',
      wifi: { name: 'net', password: 'titok' },
      contactEmail: 'host@example.com',
      // passthrough extra kulcs -> a public projekcionak strip-elnie kell
      hostInternalNote: 'belso megjegyzes',
    },
    flight: { airport: 'FCO', departure: '10:00', arrival: '12:00' },
    budget: { headline: 'Koltsegek' },
    urgentBookings: [{ name: 'Vatikan', reason: 'nepszeru', done: false }],
    usefulLinks: [{ emoji: '🔗', name: 'Info', desc: 'x', url: 'https://a.b' }],
    packingList: ['utlevel'],
    savingTips: [{ tip: 'sprol', saving: '10%' }],
    practicalInfo: [{ title: 'Info', items: ['x'] }],
    bookingChecklist: [{ item: 'foglalas', done: false }],
    insurance: { pdf: 'biztositas.pdf', label: 'Biztositas', desc: 'x' },
    overview: [{ day: 1, date: '2026-10-15', program: 'x', highlights: 'y' }],
    days: [
      {
        dayNum: 1,
        title: 'Elso nap',
        _draft: true,
        schedule: [{
          time: '10:00',
          title: 'Colosseum',
          guide: {
            history: ['regi'],
            // passthrough extra kulcs -> a public projekcionak strip-elnie kell
            internalNote: 'belso guide jegyzet',
          },
        }],
        tickets: [{ label: 'Belepo', desc: 'x', pdf: 'jegy.pdf' }],
      },
    ],
    status: 'complete',
    aiModel: 'gemini',
    expandedDays: [1],
  })
}

describe('projectPublicTrip', () => {
  it('strips tickets, uploaded docs and internal fields', () => {
    const publicTrip = projectPublicTrip(makeTrip())

    expect('insurance' in publicTrip).toBe(false)
    expect('status' in publicTrip).toBe(false)
    expect('aiModel' in publicTrip).toBe(false)
    expect('expandedDays' in publicTrip).toBe(false)
    expect('tickets' in publicTrip.days[0]).toBe(false)
    expect('_draft' in publicTrip.days[0]).toBe(false)
  })

  it('keeps the shared itinerary and accommodation the owner opted to share', () => {
    const publicTrip = projectPublicTrip(makeTrip())

    expect(publicTrip.title).toBe('Roma')
    expect(publicTrip.days[0].schedule[0].title).toBe('Colosseum')
    expect(publicTrip.accommodation.doorCode).toBe('1234')
    expect(publicTrip.flight.airport).toBe('FCO')
  })

  it('output validates against PublicTripSchema', () => {
    const publicTrip = projectPublicTrip(makeTrip())
    expect(PublicTripSchema.safeParse(publicTrip).success).toBe(true)
  })

  it('drops unknown future fields by default (whitelist)', () => {
    const withFutureField = { ...makeTrip(), privateNotes: 'titkos' }
    const publicTrip = projectPublicTrip(withFutureField as Trip)
    expect('privateNotes' in publicTrip).toBe(false)
  })

  it('strips nested passthrough extras from accommodation and guide', () => {
    const publicTrip = projectPublicTrip(makeTrip())

    // A makeTrip() valid Trip-kent atengedi ezeket a passthrough semak miatt,
    // a public projekcionak viszont el kell dobnia oket.
    expect('hostInternalNote' in publicTrip.accommodation).toBe(false)
    expect(publicTrip.accommodation.doorCode).toBe('1234')

    const guide = publicTrip.days[0].schedule[0].guide
    expect(guide && 'internalNote' in guide).toBe(false)
    expect(guide?.history).toEqual(['regi'])
  })
})

describe('SharedTripRequestSchema', () => {
  it('accepts a plausible share token', () => {
    expect(SharedTripRequestSchema.safeParse({ token: TOKEN }).success).toBe(true)
  })

  it('rejects a missing or too-short token', () => {
    expect(SharedTripRequestSchema.safeParse({}).success).toBe(false)
    expect(SharedTripRequestSchema.safeParse({ token: 'short' }).success).toBe(false)
  })
})

describe('PublicSharedTripResponseSchema', () => {
  it('strips private fields even when given a raw trip shape', () => {
    const publicTrip = projectPublicTrip(makeTrip())
    expect(PublicSharedTripResponseSchema.safeParse({ ok: true, trip: publicTrip }).success).toBe(true)

    // Vedohalo: meg ha nyers Trip-et (tickets/insurance/belso mezokkel) adnak
    // is at, a schema strip-eli a privat mezoket (parse sikeres, de tisztitott).
    const rawTrip = makeTrip()
    const bad = PublicSharedTripResponseSchema.safeParse({ ok: true, trip: rawTrip })
    expect(bad.success).toBe(true)
    if (bad.success) {
      expect('insurance' in bad.data.trip).toBe(false)
      expect('tickets' in bad.data.trip.days[0]).toBe(false)
    }
  })
})

describe('SharedWithMeResponseSchema', () => {
  it('accepts accepted trips as invite-bound public trip wrappers', () => {
    const publicTrip = projectPublicTrip(makeTrip())
    const result = SharedWithMeResponseSchema.safeParse({
      ok: true,
      sharedTrips: [{ inviteId: SHARE_ID, trip: publicTrip }],
      pendingInvites: [{
        inviteId: '550e8400-e29b-41d4-a716-446655440099',
        title: 'Fuggo Roma',
        emoji: '🇮🇹',
        subtitle: 'Meghivas',
        destination: 'Roma',
      }],
      unavailableCount: 0,
    })

    expect(result.success).toBe(true)
  })

  it('rejects the old raw PublicTrip[] shape for accepted shared trips', () => {
    const publicTrip = projectPublicTrip(makeTrip())
    const result = SharedWithMeResponseSchema.safeParse({
      ok: true,
      sharedTrips: [publicTrip],
      pendingInvites: [],
      unavailableCount: 0,
    })

    expect(result.success).toBe(false)
  })
})
