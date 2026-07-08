import type {
  BookingChecklistItem,
  Cost,
  Day,
  PracticalInfoSection,
  SavingTip,
  ScheduleItem,
  UsefulLink,
} from './trip'
import type { Draft, DraftDay } from './createTrip'
import type {
  BackupCommit,
  BackupFailedFile,
  BackupResult,
  ImportBackupError,
  ImportBackupResult,
  ImportBackupRow,
  ImportSingleBackupResponse,
  PracticalInfoSuggestionItem,
  PracticalInfoSuggestionSection,
} from './components'
import type { ScheduleAiPreview } from './hooks'

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null
}

export function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every(v => typeof v === 'string')
}

function isScheduleItem(val: unknown): val is ScheduleItem {
  if (!isRecord(val)) return false
  if (typeof val.title !== 'string') return false
  if (val.time !== undefined && typeof val.time !== 'string') return false
  if (val.type !== undefined && typeof val.type !== 'string') return false
  if (val.note !== undefined && typeof val.note !== 'string') return false
  return true
}

export function isDay(val: unknown): val is Day {
  if (!isRecord(val)) return false
  if (typeof val.dayNum !== 'number') return false
  if (typeof val.title !== 'string') return false
  if (!Array.isArray(val.schedule)) return false
  if (!val.schedule.every(isScheduleItem)) return false
  return true
}

function isDraftDay(val: unknown): val is DraftDay {
  if (!isRecord(val)) return false
  if (typeof val.day !== 'number') return false
  if (typeof val.title !== 'string') return false
  if (val.items !== undefined) {
    if (!Array.isArray(val.items)) return false
    if (!val.items.every(isScheduleItem)) return false
  }
  return true
}

function isCost(val: unknown): val is Cost {
  if (!isRecord(val)) return false
  if (typeof val.item !== 'string') return false
  if (typeof val.cost !== 'string') return false
  return true
}

function isBookingChecklistItem(val: unknown): val is BookingChecklistItem {
  if (!isRecord(val)) return false
  if (typeof val.item !== 'string') return false
  if (val.url !== undefined && typeof val.url !== 'string') return false
  if (val.done !== undefined && typeof val.done !== 'boolean') return false
  return true
}

export function isBookingChecklistItemArray(val: unknown): val is BookingChecklistItem[] {
  return Array.isArray(val) && val.every(isBookingChecklistItem)
}

function isUsefulLink(val: unknown): val is UsefulLink {
  if (!isRecord(val)) return false
  return typeof val.emoji === 'string'
    && typeof val.name === 'string'
    && typeof val.desc === 'string'
    && typeof val.url === 'string'
}

export function isUsefulLinkArray(val: unknown): val is UsefulLink[] {
  return Array.isArray(val) && val.every(isUsefulLink)
}

function isSavingTip(val: unknown): val is SavingTip {
  if (!isRecord(val)) return false
  return typeof val.tip === 'string' && typeof val.saving === 'string'
}

export function isSavingTipArray(val: unknown): val is SavingTip[] {
  return Array.isArray(val) && val.every(isSavingTip)
}

function isPracticalInfoSuggestionItem(val: unknown): val is PracticalInfoSuggestionItem {
  if (!isRecord(val)) return false
  return typeof val.label === 'string' && typeof val.value === 'string'
}

function isPracticalInfoSuggestionSection(val: unknown): val is PracticalInfoSuggestionSection {
  if (!isRecord(val)) return false
  if (typeof val.title !== 'string') return false
  if (val.items !== undefined) {
    if (!Array.isArray(val.items)) return false
    if (!val.items.every(isPracticalInfoSuggestionItem)) return false
  }
  return true
}

export function isPracticalInfoSuggestionSectionArray(val: unknown): val is PracticalInfoSuggestionSection[] {
  return Array.isArray(val) && val.every(isPracticalInfoSuggestionSection)
}

function isPracticalInfoSection(val: unknown): val is PracticalInfoSection {
  if (!isRecord(val)) return false
  return typeof val.title === 'string' && isStringArray(val.items)
}

export function isPracticalInfoSectionArray(val: unknown): val is PracticalInfoSection[] {
  return Array.isArray(val) && val.every(isPracticalInfoSection)
}

function hasStringProperty(val: Record<string, unknown>, key: string): boolean {
  return typeof val[key] === 'string'
}

function isBackupCommit(val: unknown): val is BackupCommit {
  if (!isRecord(val)) return false
  if (val.commitSha !== undefined && typeof val.commitSha !== 'string') return false
  if (val.commitUrl !== undefined && typeof val.commitUrl !== 'string') return false
  return true
}

function isBackupFailedFile(val: unknown): val is BackupFailedFile {
  if (!isRecord(val)) return false
  return hasStringProperty(val, 'path') && hasStringProperty(val, 'error')
}

export function isBackupResult(val: unknown): val is BackupResult {
  if (!isRecord(val)) return false
  if (typeof val.exportedAt !== 'string') return false
  if (typeof val.tripCount !== 'number') return false
  if (typeof val.fileCount !== 'number') return false
  if (typeof val.manifestPath !== 'string') return false
  if (val.commits !== undefined && (!Array.isArray(val.commits) || !val.commits.every(isBackupCommit))) return false
  if (val.failedFiles !== undefined && (!Array.isArray(val.failedFiles) || !val.failedFiles.every(isBackupFailedFile))) return false
  return true
}

function isImportBackupRow(val: unknown): val is ImportBackupRow {
  if (!isRecord(val)) return false
  if (typeof val.slug !== 'string') return false
  if (val.created !== undefined && typeof val.created !== 'boolean') return false
  if (val.updated !== undefined && typeof val.updated !== 'boolean') return false
  return true
}

function isImportBackupError(val: unknown): val is ImportBackupError {
  if (!isRecord(val)) return false
  if (val.index !== undefined && typeof val.index !== 'number') return false
  if (val.slug !== undefined && typeof val.slug !== 'string') return false
  return typeof val.error === 'string'
}

export function isImportBackupResult(val: unknown): val is ImportBackupResult {
  if (!isRecord(val)) return false
  if (typeof val.importedCount !== 'number') return false
  if (typeof val.failedCount !== 'number') return false
  if (!Array.isArray(val.results) || !val.results.every(isImportBackupRow)) return false
  if (!Array.isArray(val.errors) || !val.errors.every(isImportBackupError)) return false
  if (val.fileNames !== undefined && !isStringArray(val.fileNames)) return false
  return true
}

export function isImportSingleBackupResponse(val: unknown): val is ImportSingleBackupResponse {
  if (!isRecord(val)) return false
  if (val.ok !== undefined && typeof val.ok !== 'boolean') return false
  if (val.slug !== undefined && typeof val.slug !== 'string') return false
  if (val.created !== undefined && typeof val.created !== 'boolean') return false
  if (val.updated !== undefined && typeof val.updated !== 'boolean') return false
  if (val.error !== undefined && !isRecord(val.error)) return false
  if (isRecord(val.error) && val.error.message !== undefined && typeof val.error.message !== 'string') return false
  return true
}

export function getApiErrorMessage(val: unknown, fallback: string): string {
  if (!isRecord(val)) return fallback
  if (!isRecord(val.error)) return fallback
  return typeof val.error.message === 'string' ? val.error.message : fallback
}

export function isScheduleAiPreview(val: unknown): val is ScheduleAiPreview {
  if (!isRecord(val)) return false
  if (val.title !== undefined && typeof val.title !== 'string') return false
  if (val.subtitle !== undefined && typeof val.subtitle !== 'string') return false
  if (val.schedule !== undefined) {
    if (!Array.isArray(val.schedule)) return false
    if (!val.schedule.every(isScheduleItem)) return false
  }
  if (val.costs !== undefined) {
    if (!Array.isArray(val.costs)) return false
    if (!val.costs.every(isCost)) return false
  }
  return true
}

export function isDraft(val: unknown): val is Draft {
  if (!isRecord(val)) return false
  if (typeof val.title !== 'string') return false
  if (val.days !== undefined) {
    if (!Array.isArray(val.days)) return false
    if (!val.days.every(isDraftDay)) return false
  }
  return true
}
