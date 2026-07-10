import { TripImportDataSchema } from '@/schemas/trip'
import { formatZodError } from '@/schemas/errors'
import { normalizeTrip } from './normalizeTrip'
import type { ValidationResult } from '@/types/api'

export function validateTripJson(data: unknown): ValidationResult {
  const result = TripImportDataSchema.safeParse(data)
  if (result.success) {
    return { valid: true, errors: [] as [], normalizedTrip: normalizeTrip(data) }
  }
  const normalized = normalizeTrip(data)
  const recheck = TripImportDataSchema.safeParse(normalized)
  if (recheck.success) {
    return { valid: true, errors: [] as [], normalizedTrip: normalized }
  }
  return { valid: false, errors: [formatZodError(recheck.error)], normalizedTrip: null }
}
