import { normalizeTrip } from './normalizeTrip'

export function validateTripJson(data) {
  const errors = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['A JSON nem egy objektum.'], normalizedTrip: null }
  }

  if (!data.slug || typeof data.slug !== 'string') {
    if (!data.title || typeof data.title !== 'string') {
      errors.push('Hianyzo vagy ervenytelen "title" mezo.')
    }
  }

  if (!data.title || typeof data.title !== 'string') {
    if (data.slug && typeof data.slug === 'string') {
      data.title = data.slug
    } else {
      errors.push('Hianyzo vagy ervenytelen "title" mezo.')
    }
  }

  if (!data.startDate) errors.push('Hianyzo "startDate" mezo.')
  if (!data.endDate) errors.push('Hianyzo "endDate" mezo.')

  if (data.days !== undefined && !Array.isArray(data.days)) {
    errors.push('A "days" mezonek tombnek kell lennie.')
  }

  if (data.highlights !== undefined && !Array.isArray(data.highlights)) {
    errors.push('A "highlights" mezonek tombnek kell lennie.')
  }

  if (errors.length > 0) {
    return { valid: false, errors, normalizedTrip: null }
  }

  return { valid: true, errors: [], normalizedTrip: normalizeTrip(data) }
}
