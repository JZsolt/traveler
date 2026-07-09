import { normalizeTrip } from './normalizeTrip'
import type { ValidationResult } from '@/types/api'

export function validateTripJson(data: unknown): ValidationResult {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['A JSON nem egy objektum.'], normalizedTrip: null }
  }

  const obj = data as Record<string, unknown>

  if (!obj.slug || typeof obj.slug !== 'string') {
    if (!obj.title || typeof obj.title !== 'string') {
      errors.push('Hianyzo vagy ervenytelen "title" mezo.')
    }
  }

  if (!obj.title || typeof obj.title !== 'string') {
    if (obj.slug && typeof obj.slug === 'string') {
      obj.title = obj.slug
    } else {
      errors.push('Hianyzo vagy ervenytelen "title" mezo.')
    }
  }

  if (!obj.startDate) errors.push('Hianyzo "startDate" mezo.')
  if (!obj.endDate) errors.push('Hianyzo "endDate" mezo.')

  if (obj.days !== undefined && !Array.isArray(obj.days)) {
    errors.push('A "days" mezonek tombnek kell lennie.')
  }

  if (obj.highlights !== undefined && !Array.isArray(obj.highlights)) {
    errors.push('A "highlights" mezonek tombnek kell lennie.')
  }

  if (errors.length > 0) {
    return { valid: false, errors, normalizedTrip: null }
  }

  return { valid: true, errors: [] as [], normalizedTrip: normalizeTrip(data) }
}
