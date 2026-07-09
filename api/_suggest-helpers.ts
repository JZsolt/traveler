import type { VercelResponse } from '@vercel/node'
import type { Trip } from '../src/types/trip'

export function errorResponse(res: VercelResponse, status: number, message: string, code: string, retryable = false) {
  return res.status(status).json({ error: message, code, retryable })
}

export function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenced) return fenced[1].trim()
  const arrStart = text.indexOf('[')
  const arrEnd = text.lastIndexOf(']')
  const objStart = text.indexOf('{')
  const objEnd = text.lastIndexOf('}')
  if (arrStart !== -1 && arrEnd > arrStart && (objStart === -1 || arrStart <= objStart)) {
    return text.slice(arrStart, arrEnd + 1)
  }
  if (objStart !== -1 && objEnd > objStart) {
    return text.slice(objStart, objEnd + 1)
  }
  return text.trim()
}

export function tripContext(trip: Trip): string {
  return `Utazas: ${trip.title || ''}
Cel: ${trip.destination || trip.title || ''}
Datum: ${trip.startDate || ''} - ${trip.endDate || ''}
Utazok: ${trip.people || ''}`
}
