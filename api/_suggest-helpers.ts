import type { VercelResponse } from '@vercel/node'
import type { Trip } from '../src/types/trip'
import type { SectionConfig, SectionConfigOptions } from '../src/types/apiServer'
import { formatZodError } from '../src/schemas/errors'

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

export function sectionConfig<T>(opts: SectionConfigOptions<T>): SectionConfig {
  return {
    buildPrompt: opts.buildPrompt,
    system: opts.system,
    validate(parsed: unknown) {
      const result = opts.schema.safeParse(parsed)
      if (!result.success) return { ok: false as const, error: formatZodError(result.error) }
      const validated = result.data
      return { ok: true as const, data: validated, format: () => opts.format(validated) }
    },
  }
}
