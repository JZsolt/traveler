import { describe, it, expect } from 'vitest'
import { TripBackupEnvelopeSchema } from '../backup'

const validEnvelope = {
  application: 'Traveler' as const,
  version: 1,
  schema: 1,
  exportedAt: '2026-07-01T12:00:00.000Z',
  trip: {
    slug: 'rome-2026',
    trip_data: {
      title: 'Rome Trip',
      startDate: '2026-07-15',
      endDate: '2026-07-20',
    },
  },
}

describe('TripBackupEnvelopeSchema', () => {
  it('accepts valid backup envelope', () => {
    const result = TripBackupEnvelopeSchema.safeParse(validEnvelope)
    expect(result.success).toBe(true)
  })

  it('accepts envelope with optional trip fields', () => {
    const withOptional = {
      ...validEnvelope,
      trip: {
        ...validEnvelope.trip,
        id: '550e8400-e29b-41d4-a716-446655440000',
        owner: 'user@test.com',
        created_at: '2026-07-01T12:00:00.000Z',
        updated_at: '2026-07-01T12:00:00.000Z',
      },
    }
    const result = TripBackupEnvelopeSchema.safeParse(withOptional)
    expect(result.success).toBe(true)
  })

  it('rejects wrong application literal', () => {
    const invalid = { ...validEnvelope, application: 'Other' }
    expect(TripBackupEnvelopeSchema.safeParse(invalid).success).toBe(false)
  })

  it('rejects missing trip slug', () => {
    const invalid = {
      ...validEnvelope,
      trip: { trip_data: validEnvelope.trip.trip_data },
    }
    expect(TripBackupEnvelopeSchema.safeParse(invalid).success).toBe(false)
  })

  it('rejects empty slug', () => {
    const invalid = {
      ...validEnvelope,
      trip: { ...validEnvelope.trip, slug: '' },
    }
    expect(TripBackupEnvelopeSchema.safeParse(invalid).success).toBe(false)
  })

  it('rejects missing trip_data required fields', () => {
    const invalid = {
      ...validEnvelope,
      trip: { slug: 'test', trip_data: { title: 'X' } },
    }
    expect(TripBackupEnvelopeSchema.safeParse(invalid).success).toBe(false)
  })

  it('rejects invalid exportedAt', () => {
    const invalid = { ...validEnvelope, exportedAt: 'yesterday' }
    expect(TripBackupEnvelopeSchema.safeParse(invalid).success).toBe(false)
  })

  it('rejects non-object input', () => {
    expect(TripBackupEnvelopeSchema.safeParse(null).success).toBe(false)
    expect(TripBackupEnvelopeSchema.safeParse('string').success).toBe(false)
  })

  it('accepts null owner', () => {
    const withNull = {
      ...validEnvelope,
      trip: { ...validEnvelope.trip, owner: null },
    }
    expect(TripBackupEnvelopeSchema.safeParse(withNull).success).toBe(true)
  })
})
