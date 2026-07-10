import { describe, it, expect } from 'vitest'
import {
  ChatReplyEnvelopeSchema,
  ChatErrorEnvelopeSchema,
  PlanTripEnvelopeSchema,
  ExpandDayEnvelopeSchema,
  SuggestSectionEnvelopeSchema,
  PlanTripDraftSchema,
  ExpandDayResponseSchema,
  ScheduleItemResponseSchema,
} from '../ai'

describe('ChatReplyEnvelopeSchema', () => {
  it('accepts valid reply', () => {
    const result = ChatReplyEnvelopeSchema.safeParse({ reply: 'Hello' })
    expect(result.success).toBe(true)
  })

  it('rejects missing reply', () => {
    expect(ChatReplyEnvelopeSchema.safeParse({}).success).toBe(false)
    expect(ChatReplyEnvelopeSchema.safeParse({ message: 'hi' }).success).toBe(false)
  })
})

describe('ChatErrorEnvelopeSchema', () => {
  it('accepts error with retryable', () => {
    const result = ChatErrorEnvelopeSchema.safeParse({ error: 'Rate limit', retryable: true })
    expect(result.success).toBe(true)
  })

  it('accepts error without retryable', () => {
    const result = ChatErrorEnvelopeSchema.safeParse({ error: 'Server error' })
    expect(result.success).toBe(true)
  })

  it('rejects missing error field', () => {
    expect(ChatErrorEnvelopeSchema.safeParse({ retryable: true }).success).toBe(false)
  })
})

describe('PlanTripEnvelopeSchema', () => {
  it('accepts valid plan trip response', () => {
    const result = PlanTripEnvelopeSchema.safeParse({
      trip: { title: 'Rome Trip' },
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing trip field', () => {
    expect(PlanTripEnvelopeSchema.safeParse({}).success).toBe(false)
  })

  it('rejects trip without title', () => {
    expect(PlanTripEnvelopeSchema.safeParse({ trip: {} }).success).toBe(false)
  })
})

describe('ExpandDayEnvelopeSchema', () => {
  it('accepts valid expanded day', () => {
    const result = ExpandDayEnvelopeSchema.safeParse({
      day: {
        title: 'Day 1',
        schedule: [{ time: '09:00', title: 'Arrive' }],
      },
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing day', () => {
    expect(ExpandDayEnvelopeSchema.safeParse({}).success).toBe(false)
  })

  it('rejects day without schedule', () => {
    expect(ExpandDayEnvelopeSchema.safeParse({ day: { title: 'X' } }).success).toBe(false)
  })
})

describe('SuggestSectionEnvelopeSchema', () => {
  it('accepts any suggestion shape', () => {
    const result = SuggestSectionEnvelopeSchema.safeParse({
      suggestion: ['item1', 'item2'],
      summary: '2 items',
    })
    expect(result.success).toBe(true)
  })

  it('accepts suggestion without summary', () => {
    const result = SuggestSectionEnvelopeSchema.safeParse({ suggestion: { key: 'val' } })
    expect(result.success).toBe(true)
  })
})

describe('PlanTripDraftSchema', () => {
  it('accepts minimal draft', () => {
    const result = PlanTripDraftSchema.safeParse({ title: 'My Trip' })
    expect(result.success).toBe(true)
  })

  it('accepts draft with days', () => {
    const result = PlanTripDraftSchema.safeParse({
      title: 'Rome',
      destination: 'Italy',
      days: [{ day: 1, title: 'Arrival', items: [{ title: 'Check in' }] }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    expect(PlanTripDraftSchema.safeParse({ destination: 'Rome' }).success).toBe(false)
  })
})

describe('ExpandDayResponseSchema', () => {
  it('accepts response with schedule', () => {
    const result = ExpandDayResponseSchema.safeParse({
      schedule: [{ time: '10:00', title: 'Museum' }],
    })
    expect(result.success).toBe(true)
  })

  it('preserves extra keys via passthrough', () => {
    const result = ExpandDayResponseSchema.safeParse({
      schedule: [{ time: '10:00', title: 'Museum' }],
      customField: 'preserved',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toMatchObject({ customField: 'preserved' })
    }
  })

  it('rejects missing schedule', () => {
    expect(ExpandDayResponseSchema.safeParse({ title: 'Day 1' }).success).toBe(false)
  })
})

describe('ScheduleItemResponseSchema', () => {
  it('accepts item with title only', () => {
    const result = ScheduleItemResponseSchema.safeParse({ title: 'Visit' })
    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    expect(ScheduleItemResponseSchema.safeParse({ title: '' }).success).toBe(false)
  })

  it('preserves extra keys via passthrough', () => {
    const result = ScheduleItemResponseSchema.safeParse({ title: 'Visit', extra: true })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toMatchObject({ extra: true })
    }
  })
})
