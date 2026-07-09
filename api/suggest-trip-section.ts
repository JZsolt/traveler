import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from '@google/genai'
import type { SectionKey, ParsedRecord, SectionExtra } from '../src/types/apiServer'
import type { Trip } from '../src/types/trip'
import { VALID_SECTIONS, SECTION_CONFIG } from './_section-configs'
import { errorResponse, extractJson } from './_suggest-helpers'
import { getFirstFinishReason, isRecord, isSectionKey, isTrip } from './_narrowing'

const DEFAULT_MODEL = 'gemini-3.1-flash-lite'

async function handleSection(res: VercelResponse, section: SectionKey, trip: Trip, instruction: string | undefined, extra: SectionExtra = {}) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return errorResponse(res, 500, 'GEMINI_API_KEY nincs konfigurálva a szerveren.', 'AI_SERVER_ERROR')
  }

  const config = SECTION_CONFIG[section]
  const prompt = config.buildPrompt(trip, instruction, extra)

  try {
    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      config: {
        systemInstruction: config.system,
        temperature: 0.7,
        maxOutputTokens: 4000,
        responseMimeType: 'application/json',
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const raw = response.text || ''

    if (!raw) {
      return errorResponse(res, 502, 'Üres válasz az AI-tól.', 'AI_SERVER_ERROR', true)
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      const jsonStr = extractJson(raw)
      try {
        parsed = JSON.parse(jsonStr)
      } catch {
        const truncated = getFirstFinishReason(response.candidates) === 'MAX_TOKENS'
        return errorResponse(
          res, 502,
          truncated ? 'A válasz túllépte a token limitet és csonka maradt.' : 'Az AI nem adott értelmezhető JSON-t.',
          truncated ? 'AI_TOKEN_LIMIT' : 'AI_INVALID_JSON',
          true
        )
      }
    }

    const validationError = config.validate(parsed)
    if (validationError) {
      return errorResponse(res, 502, `Az AI válasz formátuma nem megfelelő (${validationError}).`, 'AI_INVALID_JSON', true)
    }

    return res.status(200).json(config.format(parsed))
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    const is429 = message.includes('429') || message.includes('RESOURCE_EXHAUSTED')

    if (is429) {
      return errorResponse(res, 429, 'Elérted az AI limitet. Próbáld újra később.', 'AI_RATE_LIMIT', true)
    }
    return errorResponse(res, 502, 'AI szerver hiba.', 'AI_SERVER_ERROR', true)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Csak POST kérés engedélyezett.', 'AI_INVALID_REQUEST')
  }

  const body: unknown = req.body || {}
  if (!isRecord(body)) {
    return errorResponse(res, 400, 'Hiányzó vagy érvénytelen request body.', 'AI_INVALID_REQUEST')
  }

  const section = body.section
  const trip = body.trip
  const instruction = body.instruction
  const dayNum = body.dayNum
  const itemIndex = body.itemIndex

  if (!isSectionKey(section, VALID_SECTIONS)) {
    return errorResponse(res, 400, `Érvénytelen szekció: "${String(section)}". Engedélyezett: ${VALID_SECTIONS.join(', ')}.`, 'AI_INVALID_REQUEST')
  }

  if (!isTrip(trip)) {
    return errorResponse(res, 400, 'Hiányzó vagy érvénytelen "trip" mező.', 'AI_INVALID_REQUEST')
  }

  if (instruction !== undefined && typeof instruction !== 'string') {
    return errorResponse(res, 400, 'Az "instruction" mezőnek szövegnek kell lennie.', 'AI_INVALID_REQUEST')
  }

  if (section === 'day' && (dayNum === undefined || typeof dayNum !== 'number')) {
    return errorResponse(res, 400, 'A "day" szekcióhoz "dayNum" (szám) szükséges.', 'AI_INVALID_REQUEST')
  }

  if (section === 'scheduleItemGuide' && (dayNum === undefined || itemIndex === undefined)) {
    return errorResponse(res, 400, 'A "scheduleItemGuide" szekcióhoz "dayNum" és "itemIndex" szükséges.', 'AI_INVALID_REQUEST')
  }

  if (section === 'scheduleItem' && (dayNum === undefined || itemIndex === undefined)) {
    return errorResponse(res, 400, 'A "scheduleItem" szekcióhoz "dayNum" és "itemIndex" szükséges.', 'AI_INVALID_REQUEST')
  }

  const validInstruction = typeof instruction === 'string' ? instruction : undefined
  const extra: SectionExtra = {
    dayNum: typeof dayNum === 'number' ? dayNum : undefined,
    itemIndex: typeof itemIndex === 'number' ? itemIndex : undefined,
  }

  return handleSection(res, section, trip, validInstruction, extra)
}
