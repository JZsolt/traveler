import type { ChatMessage, ParsedRecord, SectionKey } from '../src/types/apiServer'

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
