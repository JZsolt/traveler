import { describe, it, expect } from 'vitest'
import { validateTripJson } from '../validateTripJson'
import { TripSchema } from '@/schemas/trip'

describe('validateTripJson', () => {
  it('accepts valid import data with required fields', () => {
    const result = validateTripJson({ title: 'Trip', startDate: '2026-07-01', endDate: '2026-07-03' })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.normalizedTrip).toBeDefined()
      expect(TripSchema.safeParse(result.normalizedTrip).success).toBe(true)
    }
  })

  it('accepts full trip data', () => {
    const fullTrip = {
      slug: 'test',
      title: 'Test',
      subtitle: 'Sub',
      emoji: '🇭🇺',
      startDate: '2026-07-01',
      endDate: '2026-07-03',
      people: '2',
      highlights: [],
      accommodation: {},
      flight: {},
      budget: {},
      urgentBookings: [],
      usefulLinks: [],
      packingList: [],
      savingTips: [],
      practicalInfo: [],
      bookingChecklist: [],
      overview: [],
      days: [],
    }
    const result = validateTripJson(fullTrip)
    expect(result.valid).toBe(true)
  })

  it('normalizes null input to valid defaults (lenient)', () => {
    const result = validateTripJson(null)
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.normalizedTrip.title).toBe('')
      expect(TripSchema.safeParse(result.normalizedTrip).success).toBe(true)
    }
  })

  it('normalizes empty object to valid defaults (lenient)', () => {
    const result = validateTripJson({})
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(TripSchema.safeParse(result.normalizedTrip).success).toBe(true)
    }
  })

  it('normalizes partial data that can be salvaged', () => {
    const partial = {
      title: 'Trip',
      startDate: '2026-07-01',
      endDate: '2026-07-03',
      packingList: ['shirt', 42, 'pants'],
    }
    const result = validateTripJson(partial)
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.normalizedTrip.packingList).toEqual(['shirt', 'pants'])
    }
  })

  it('returns normalized trip that passes TripSchema', () => {
    const inputs: unknown[] = [null, {}, { title: 'X' }, { title: 'Y', startDate: '2026-01-01', endDate: '2026-01-02' }]
    for (const input of inputs) {
      const result = validateTripJson(input)
      if (result.valid) {
        expect(TripSchema.safeParse(result.normalizedTrip).success).toBe(true)
      }
    }
  })
})
