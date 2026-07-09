import type { ChatMessage, ParsedRecord, SectionKey, TripBackupBody } from '../src/types/apiServer'
import type { Trip, TripImportData } from '../src/types/trip'

export function isRecord(value: unknown): value is ParsedRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string')
}

export function asBool(value: unknown): boolean {
  return value === true
}

export function asRecordArray(value: unknown): ParsedRecord[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is ParsedRecord => isRecord(v))
}

export function isChatMessageArray(value: unknown): value is ChatMessage[] {
  return Array.isArray(value) && value.every(item => (
    isRecord(item)
    && typeof item.role === 'string'
    && typeof item.content === 'string'
  ))
}

export function getFirstFinishReason(value: unknown): string | undefined {
  if (!Array.isArray(value) || !isRecord(value[0])) return undefined
  return asString(value[0].finishReason) || undefined
}

export function isSectionKey(value: unknown, validSections: SectionKey[]): value is SectionKey {
  return typeof value === 'string' && validSections.some(section => section === value)
}

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function isRecordArray(value: unknown): boolean {
  return Array.isArray(value) && value.every(isRecord)
}

function isScheduleItem(value: unknown): boolean {
  if (!isRecord(value) || typeof value.title !== 'string' || typeof value.time !== 'string') return false
  if (value.links === undefined) return true

  return Array.isArray(value.links) && value.links.every(link => (
    isRecord(link)
    && typeof link.label === 'string'
    && typeof link.url === 'string'
  ))
}

function isDay(value: unknown): boolean {
  return isRecord(value)
    && typeof value.dayNum === 'number'
    && typeof value.title === 'string'
    && Array.isArray(value.schedule)
    && value.schedule.every(isScheduleItem)
}

function isPracticalInfoSection(value: unknown): boolean {
  return isRecord(value)
    && typeof value.title === 'string'
    && isStringArray(value.items)
}

export function isTrip(value: unknown): value is Trip {
  if (!isRecord(value)) return false

  const requiredStrings = ['slug', 'title', 'subtitle', 'emoji', 'startDate', 'endDate', 'people']
  if (!requiredStrings.every(key => typeof value[key] === 'string')) return false

  return isStringArray(value.highlights)
    && isRecordArray(value.urgentBookings)
    && isRecordArray(value.usefulLinks)
    && isStringArray(value.packingList)
    && isRecordArray(value.savingTips)
    && Array.isArray(value.practicalInfo)
    && value.practicalInfo.every(isPracticalInfoSection)
    && isRecordArray(value.bookingChecklist)
    && isRecordArray(value.overview)
    && Array.isArray(value.days)
    && value.days.every(isDay)
    && isRecord(value.accommodation)
    && isRecord(value.flight)
    && isRecord(value.budget)
}

export function isTripImportData(value: unknown): value is TripImportData {
  return isRecord(value)
    && typeof value.title === 'string'
    && typeof value.startDate === 'string'
    && typeof value.endDate === 'string'
}

export function isTripBackupBody(value: unknown): value is TripBackupBody {
  if (!isRecord(value) || value.application !== 'Traveler' || !isRecord(value.trip)) return false
  if (typeof value.trip.slug !== 'string' || !isTripImportData(value.trip.trip_data)) return false

  const owner = value.trip.owner
  return owner === undefined || owner === null || typeof owner === 'string'
}
