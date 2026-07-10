import { z } from 'zod'
import {
  DaySchema, UsefulLinkSchema, SavingTipSchema,
  BookingChecklistItemSchema,
} from '@/schemas/trip'
import {
  PlanTripDraftSchema, ExpandDayResponseSchema,
  PracticalInfoAiSectionSchema, DayMetaResponseSchema, ScheduleItemResponseSchema,
  ScheduleItemGuideResponseSchema,
} from '@/schemas/ai'
import {
  BackupResultSchema, ImportBackupResultSchema, ImportSingleBackupResponseSchema,
} from '@/schemas/apiResponses'
import type { Day } from './trip'
import type { Draft } from './createTrip'
import type {
  BackupResult,
  ImportBackupResult,
  ImportSingleBackupResponse,
  PracticalInfoSuggestionSection,
} from './components'
import type { ScheduleAiPreview, DayMetaDraft, ScheduleItemDraft } from './hooks'

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

export function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every(v => typeof v === 'string')
}

export function isDay(val: unknown): val is Day {
  return DaySchema.safeParse(val).success
}

export function isDraft(val: unknown): val is Draft {
  return PlanTripDraftSchema.safeParse(val).success
}

export function isBookingChecklistItemArray(val: unknown): val is z.infer<typeof BookingChecklistItemSchema>[] {
  return z.array(BookingChecklistItemSchema).safeParse(val).success
}

export function isUsefulLinkArray(val: unknown): val is z.infer<typeof UsefulLinkSchema>[] {
  return z.array(UsefulLinkSchema).safeParse(val).success
}

export function isSavingTipArray(val: unknown): val is z.infer<typeof SavingTipSchema>[] {
  return z.array(SavingTipSchema).safeParse(val).success
}

export function isPracticalInfoSuggestionSectionArray(val: unknown): val is PracticalInfoSuggestionSection[] {
  return z.array(PracticalInfoAiSectionSchema).safeParse(val).success
}

export function isScheduleAiPreview(val: unknown): val is ScheduleAiPreview {
  return ExpandDayResponseSchema.safeParse(val).success
}

export function isDayMetaSuggestion(val: unknown): val is DayMetaDraft {
  return DayMetaResponseSchema.safeParse(val).success
}

export function isGuide(val: unknown): val is z.infer<typeof ScheduleItemGuideResponseSchema> {
  return ScheduleItemGuideResponseSchema.safeParse(val).success
}

export function isScheduleItemSuggestion(val: unknown): val is Partial<ScheduleItemDraft> {
  return ScheduleItemResponseSchema.safeParse(val).success
}

export function isBackupResult(val: unknown): val is BackupResult {
  return BackupResultSchema.safeParse(val).success
}

export function isImportBackupResult(val: unknown): val is ImportBackupResult {
  return ImportBackupResultSchema.safeParse(val).success
}

export function isImportSingleBackupResponse(val: unknown): val is ImportSingleBackupResponse {
  return ImportSingleBackupResponseSchema.safeParse(val).success
}

export function getApiErrorMessage(val: unknown, fallback: string): string {
  if (!isRecord(val)) return fallback
  if (!isRecord(val.error)) return fallback
  return typeof val.error.message === 'string' ? val.error.message : fallback
}
