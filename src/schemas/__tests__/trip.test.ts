import { describe, it, expect } from 'vitest'
import { TripSchema, TripImportDataSchema, DaySchema, ScheduleItemSchema } from '../trip'

const minimalScheduleItem = { time: '09:00', title: 'Arrive' }

const minimalDay = {
  dayNum: 1,
  title: 'Day 1',
  schedule: [minimalScheduleItem],
}

const minimalTrip = {
  slug: 'test-trip',
  title: 'Test Trip',
  subtitle: 'A test',
  emoji: '🇭🇺',
  startDate: '2026-07-01',
  endDate: '2026-07-03',
  people: '2 felnott',
  highlights: ['sight'],
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
  days: [minimalDay],
}

describe('TripSchema', () => {
  it('accepts a valid minimal trip', () => {
    const result = TripSchema.safeParse(minimalTrip)
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = TripSchema.safeParse({ slug: 'x' })
    expect(result.success).toBe(false)
  })

  it('rejects non-object input', () => {
    expect(TripSchema.safeParse(null).success).toBe(false)
    expect(TripSchema.safeParse('string').success).toBe(false)
    expect(TripSchema.safeParse(42).success).toBe(false)
  })

  it('accepts optional fields when present', () => {
    const trip = { ...minimalTrip, destination: 'Budapest', status: 'upcoming', aiModel: 'gemini' }
    const result = TripSchema.safeParse(trip)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.destination).toBe('Budapest')
    }
  })
})

describe('TripImportDataSchema', () => {
  it('accepts data with only required import fields', () => {
    const importData = { title: 'Trip', startDate: '2026-07-01', endDate: '2026-07-03' }
    const result = TripImportDataSchema.safeParse(importData)
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const result = TripImportDataSchema.safeParse({ startDate: '2026-07-01', endDate: '2026-07-03' })
    expect(result.success).toBe(false)
  })

  it('rejects missing startDate', () => {
    const result = TripImportDataSchema.safeParse({ title: 'Trip', endDate: '2026-07-03' })
    expect(result.success).toBe(false)
  })

  it('rejects missing endDate', () => {
    const result = TripImportDataSchema.safeParse({ title: 'Trip', startDate: '2026-07-01' })
    expect(result.success).toBe(false)
  })

  it('accepts full trip data as import data', () => {
    const result = TripImportDataSchema.safeParse(minimalTrip)
    expect(result.success).toBe(true)
  })
})

describe('DaySchema', () => {
  it('accepts a minimal day', () => {
    const result = DaySchema.safeParse(minimalDay)
    expect(result.success).toBe(true)
  })

  it('rejects day without schedule', () => {
    const result = DaySchema.safeParse({ dayNum: 1, title: 'Day 1' })
    expect(result.success).toBe(false)
  })

  it('rejects day with empty required fields', () => {
    const result = DaySchema.safeParse({ dayNum: 'not a number', title: 'Day', schedule: [] })
    expect(result.success).toBe(false)
  })
})

describe('ScheduleItemSchema', () => {
  it('accepts minimal item', () => {
    const result = ScheduleItemSchema.safeParse(minimalScheduleItem)
    expect(result.success).toBe(true)
  })

  it('accepts item with all optional fields', () => {
    const full = {
      ...minimalScheduleItem,
      desc: 'Description',
      highlight: true,
      optional: false,
      badges: ['kid-friendly'],
      links: [{ label: 'Map', url: 'https://maps.google.com' }],
      guide: { history: ['Founded in 1800'], tips: ['Go early'] },
    }
    const result = ScheduleItemSchema.safeParse(full)
    expect(result.success).toBe(true)
  })

  it('rejects item without title', () => {
    const result = ScheduleItemSchema.safeParse({ time: '10:00' })
    expect(result.success).toBe(false)
  })
})
