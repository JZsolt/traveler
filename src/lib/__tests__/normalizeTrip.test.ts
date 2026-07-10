import { describe, it, expect } from 'vitest'
import { normalizeTrip } from '../normalizeTrip'
import { TripSchema } from '@/schemas/trip'

const minimalValidTrip = {
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
  days: [{ dayNum: 1, title: 'Day 1', schedule: [{ time: '09:00', title: 'Go' }] }],
}

describe('normalizeTrip — non-object input', () => {
  it('returns defaults for null', () => {
    const result = normalizeTrip(null)
    expect(result.slug).toBe('')
    expect(result.title).toBe('')
    expect(TripSchema.safeParse(result).success).toBe(true)
  })

  it('returns defaults for undefined', () => {
    const result = normalizeTrip(undefined)
    expect(TripSchema.safeParse(result).success).toBe(true)
  })

  it('returns defaults for string', () => {
    const result = normalizeTrip('not an object')
    expect(TripSchema.safeParse(result).success).toBe(true)
  })

  it('returns defaults for array', () => {
    const result = normalizeTrip([1, 2, 3])
    expect(TripSchema.safeParse(result).success).toBe(true)
  })

  it('returns defaults for number', () => {
    const result = normalizeTrip(42)
    expect(TripSchema.safeParse(result).success).toBe(true)
  })
})

describe('normalizeTrip — valid trips', () => {
  it('preserves a valid complete trip unchanged', () => {
    const result = normalizeTrip(minimalValidTrip)
    expect(result.slug).toBe('test')
    expect(result.title).toBe('Test')
    expect(result.days).toHaveLength(1)
    expect(result.days[0].schedule).toHaveLength(1)
  })

  it('fast-path returns parsed data for valid trip', () => {
    const result = normalizeTrip(minimalValidTrip)
    expect(TripSchema.safeParse(result).success).toBe(true)
  })
})

describe('normalizeTrip — partial/legacy data', () => {
  it('normalizes partial trip with missing optional fields', () => {
    const partial = { slug: 'x', title: 'X', subtitle: 's', emoji: '🇭🇺', startDate: '2026-01-01', endDate: '2026-01-02', people: '1' }
    const result = normalizeTrip(partial)
    expect(result.slug).toBe('x')
    expect(result.highlights).toEqual([])
    expect(result.days).toEqual([])
    expect(result.packingList).toEqual([])
    expect(TripSchema.safeParse(result).success).toBe(true)
  })

  it('normalizes missing accommodation to defaults', () => {
    const result = normalizeTrip({ ...minimalValidTrip, accommodation: undefined })
    expect(result.accommodation).toBeDefined()
    expect(result.accommodation.address).toBe('')
  })

  it('preserves optional string fields', () => {
    const withOptional = { ...minimalValidTrip, destination: 'Budapest', status: 'upcoming' }
    const result = normalizeTrip(withOptional)
    expect(result.destination).toBe('Budapest')
    expect(result.status).toBe('upcoming')
  })
})

describe('normalizeTrip — invalid nested arrays', () => {
  it('filters invalid items from highlights', () => {
    const data = { ...minimalValidTrip, highlights: ['valid', 42, null, 'also valid'] }
    const result = normalizeTrip(data)
    expect(result.highlights).toEqual(['valid', 'also valid'])
  })

  it('filters invalid schedule items from days', () => {
    const data = {
      ...minimalValidTrip,
      days: [{
        dayNum: 1,
        title: 'Day 1',
        schedule: [
          { time: '09:00', title: 'Valid' },
          { time: '10:00' },
          'not an object',
          { time: '11:00', title: 'Also Valid' },
        ],
      }],
    }
    const result = normalizeTrip(data)
    expect(result.days[0].schedule).toHaveLength(2)
    expect(result.days[0].schedule[0].title).toBe('Valid')
    expect(result.days[0].schedule[1].title).toBe('Also Valid')
  })

  it('filters invalid days entirely', () => {
    const data = {
      ...minimalValidTrip,
      days: [
        { dayNum: 1, title: 'Good', schedule: [{ time: '09:00', title: 'Go' }] },
        { title: 'Missing dayNum', schedule: [] },
        'not a day',
      ],
    }
    const result = normalizeTrip(data)
    expect(result.days).toHaveLength(1)
    expect(result.days[0].title).toBe('Good')
  })

  it('filters invalid usefulLinks', () => {
    const data = {
      ...minimalValidTrip,
      usefulLinks: [
        { emoji: '🗺', name: 'Map', desc: 'Google Maps', url: 'https://maps.google.com' },
        { emoji: '🗺', name: 'Bad' },
      ],
    }
    const result = normalizeTrip(data)
    expect(result.usefulLinks).toHaveLength(1)
    expect(result.usefulLinks[0].name).toBe('Map')
  })

  it('filters invalid packingList items', () => {
    const data = { ...minimalValidTrip, packingList: ['shirt', 42, null, 'pants'] }
    const result = normalizeTrip(data)
    expect(result.packingList).toEqual(['shirt', 'pants'])
  })
})

describe('normalizeTrip — output always valid', () => {
  it('result always passes TripSchema', () => {
    const inputs: unknown[] = [
      null,
      {},
      { slug: 'x' },
      { title: 'Y', days: 'not array' },
      minimalValidTrip,
    ]
    for (const input of inputs) {
      const result = normalizeTrip(input)
      expect(TripSchema.safeParse(result).success).toBe(true)
    }
  })
})
