import { z } from 'zod'
import {
  LinkSchema, GuideSchema, ScheduleItemSchema,
  CostSchema, UsefulLinkSchema, SavingTipSchema, BookingChecklistItemSchema,
} from './trip'

// --- chat.ts: plain text response ---

export const ChatAiResponseSchema = z.string().min(1)

// --- plan-trip.ts: AI generates a simplified draft, not a full Trip ---

export const PlanTripDraftItemSchema = z.object({
  time: z.string().optional(),
  title: z.string(),
  type: z.string().optional(),
  note: z.string().optional(),
})

export const PlanTripDraftDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  summary: z.string().optional(),
  items: z.array(PlanTripDraftItemSchema).optional(),
})

export const PlanTripDraftSchema = z.object({
  title: z.string(),
  destination: z.string().optional(),
  emoji: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  people: z.string().optional(),
  days: z.array(PlanTripDraftDaySchema).optional(),
  tips: z.array(z.string()).optional(),
})

// --- expand-day.ts: expanded day with full schedule ---

export const ExpandDayResponseSchema = z.object({
  dayNum: z.number().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  schedule: z.array(ScheduleItemSchema),
  costs: z.array(CostSchema).optional(),
}).passthrough()

// --- suggest-trip-section: per-section AI response schemas ---

export const PackingListResponseSchema = z.array(z.string())

export const UsefulLinksResponseSchema = z.array(UsefulLinkSchema)

export const SavingTipsResponseSchema = z.array(SavingTipSchema)

export const BookingChecklistResponseSchema = z.array(BookingChecklistItemSchema)

export const PracticalInfoAiItemSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const PracticalInfoAiSectionSchema = z.object({
  title: z.string(),
  items: z.array(PracticalInfoAiItemSchema),
})

export const PracticalInfoResponseSchema = z.array(PracticalInfoAiSectionSchema)

export const DayMetaResponseSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
})

export const ScheduleItemGuideResponseSchema = GuideSchema

// --- Frontend API response envelopes ---

export const ChatReplyEnvelopeSchema = z.object({
  reply: z.string(),
})

export const ChatErrorEnvelopeSchema = z.object({
  error: z.string(),
  retryable: z.boolean().optional(),
})

export const PlanTripEnvelopeSchema = z.object({
  trip: PlanTripDraftSchema,
})

export const ExpandDayEnvelopeSchema = z.object({
  day: ExpandDayResponseSchema,
})

export const SuggestSectionEnvelopeSchema = z.object({
  suggestion: z.unknown(),
  summary: z.string().optional(),
})

// --- Server-side request body schemas ---

export const SuggestSectionRequestSchema = z.object({
  section: z.string(),
  trip: z.unknown(),
  instruction: z.string().optional(),
  dayNum: z.number().optional(),
  itemIndex: z.number().optional(),
})

// Lenient: time optional, passthrough for transport and extra AI fields
export const ScheduleItemResponseSchema = z.object({
  title: z.string().min(1),
  time: z.string().optional(),
  desc: z.string().optional(),
  highlight: z.boolean().optional(),
  optional: z.boolean().optional(),
  badges: z.array(z.string()).optional(),
  links: z.array(LinkSchema).optional(),
  guide: GuideSchema.optional(),
}).passthrough()
