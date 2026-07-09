import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from '@google/genai'
import type { GeminiModels, DetailLevelConfig, ChatMessage } from '../src/types/apiServer'
import { getFirstFinishReason, isChatMessageArray, isRecord } from './_narrowing'

const DEFAULT_MODEL = 'gemini-3.1-flash-lite'

const MODELS: GeminiModels = {
  'gemini-2.5-flash': { label: 'Gemini 2.5 Flash' },
  'gemini-3.1-flash-lite': { label: 'Gemini 3.1 Flash Lite' },
}

const DETAIL_LEVELS: Record<string, DetailLevelConfig> = {
  quick: { maxItems: 3, maxTokens: 8000, label: 'gyors' },
  normal: { maxItems: 4, maxTokens: 12000, label: 'normal' },
  detailed: { maxItems: 6, maxTokens: 16000, label: 'reszletes' },
}

function buildPrompt(detailLevel: string, instruction = ''): string {
  const { maxItems } = DETAIL_LEVELS[detailLevel] || DETAIL_LEVELS.quick
  const extraInstruction = instruction.trim()
    ? `\nEXTRA USER INSTRUKCIO A GENERÁLÁSHOZ:\n${instruction.trim()}\n`
    : ''

  return `Te egy utazastervezo. Valaszolj KIZAROLAG valid JSON-nal. Semmi markdown, semmi magyarazat.
Keszits kompakt utitervet a user kerése alapjan.
Rovid magyar szoveget hasznalj. Max ${maxItems} item naponta. Minden note max 120 karakter. Tips max 5.
${extraInstruction}

PONTOS SCHEMA:
{
  "title": "Varos · Varos2",
  "destination": "Varos",
  "emoji": "🇮🇹",
  "startDate": "2026-01-01",
  "endDate": "2026-01-03",
  "people": "4 felnott",
  "days": [
    {
      "day": 1,
      "title": "Nap cime",
      "summary": "Rovid osszefoglalas",
      "items": [
        { "time": "10:00", "title": "Hely neve", "type": "sight", "note": "Rovid leiras" }
      ]
    }
  ],
  "tips": ["Tipp 1"]
}

type ertekek: sight, food, travel, rest, activity
Csak JSON, semmi mas!`
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenced) return fenced[1].trim()
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first !== -1 && last > first) return text.slice(first, last + 1)
  return text.trim()
}

function validateDraft(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!isRecord(data)) return { valid: false, errors: ['Nem objektum'] }
  if (typeof data.title !== 'string' || !data.title) errors.push('Hianyzo "title"')
  if (!Array.isArray(data.days)) errors.push('Hianyzo vagy ervenytelen "days"')
  if (errors.length > 0) return { valid: false, errors }
  return { valid: true, errors: [] }
}

function trimMessages(messages: ChatMessage[]): ChatMessage[] {
  const userMessages = messages.filter(m => m.role === 'user')
  if (userMessages.length <= 3) return messages

  const last3 = userMessages.slice(-3)
  const summary = userMessages.slice(0, -3).map(m => m.content).join(' | ')
  return [
    { role: 'user', content: `Korabbi kontextus: ${summary.slice(0, 300)}` },
    ...last3,
  ]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY nincs konfigurálva a szerveren.' })
  }

  const body: unknown = req.body || {}
  if (!isRecord(body)) {
    return res.status(400).json({ error: 'Hianyzo request body.' })
  }

  const messages = body.messages
  const detailLevel = typeof body.detailLevel === 'string' ? body.detailLevel : 'quick'
  const requestedModel = body.model
  const instruction = typeof body.instruction === 'string' ? body.instruction : ''

  if (!isChatMessageArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Hianyzo vagy ures "messages" mezo.' })
  }

  const totalLength = messages.reduce((sum, m) => sum + m.content.length, 0)
  if (totalLength > 1500) {
    console.log('[plan-trip] Request too long, trimming messages', { totalLength })
  }

  const level = DETAIL_LEVELS[detailLevel] ? detailLevel : 'quick'
  const { maxTokens } = DETAIL_LEVELS[level]
  const model = typeof requestedModel === 'string' && MODELS[requestedModel] ? requestedModel : DEFAULT_MODEL

  console.log('[plan-trip]', {
    model,
    detailLevel: level,
    messageCount: messages.length,
    promptLength: totalLength,
    hasInstruction: Boolean(instruction.trim()),
    maxOutputTokens: maxTokens,
  })

  try {
    const ai = new GoogleGenAI({ apiKey })
    const trimmed = trimMessages(messages)

    const contents = [
      ...trimmed.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }],
      })),
      {
        role: 'user' as const,
        parts: [{ text: 'A fenti beszelgetes alapjan generald a kompakt utitervet JSON-ben! A PONTOS SCHEMA-t kovesd, semmi mas szoveg, csak JSON.' }],
      },
    ]

    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction: buildPrompt(level, instruction),
        temperature: 0.7,
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
      },
      contents,
    })

    const raw = response.text || ''
    const finishReason = getFirstFinishReason(response.candidates)
    console.log('[plan-trip] Raw response length:', raw.length, 'finishReason:', finishReason)

    if (!raw) {
      return res.status(502).json({ error: 'Ures valasz a Gemini-tol.' })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      const jsonStr = extractJson(raw)
      try {
        parsed = JSON.parse(jsonStr)
      } catch (parseErr) {
        const truncated = finishReason === 'MAX_TOKENS'
        const msg = parseErr instanceof Error ? parseErr.message : 'Unknown'
        console.log('[plan-trip] JSON parse error:', msg, 'truncated:', truncated, 'raw tail:', raw.slice(-100))
        return res.status(502).json({
          error: truncated
            ? 'A valasz tullepo a token limitet es csonka maradt. Probald Gyors modban.'
            : 'A Gemini nem adott valid JSON-t.',
          raw: raw.slice(0, 500),
          retryable: true,
        })
      }
    }

    const { valid, errors } = validateDraft(parsed)
    if (!valid) {
      return res.status(502).json({ error: 'A generalt trip JSON nem valid.', details: errors })
    }

    return res.status(200).json({ trip: parsed })
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    const is429 = message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
    console.log('[plan-trip] Error', { is429, detail: message.slice(0, 200) })

    if (is429) {
      return res.status(429).json({
        error: 'Elerved az ingyenes AI limitet. Probald ujra kesobb, vagy valts Gyors terv modra.',
        retryable: true,
      })
    }
    return res.status(502).json({ error: 'Gemini API hiba.', details: message })
  }
}
