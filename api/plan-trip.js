import { GoogleGenAI } from '@google/genai'

const DETAIL_LEVELS = {
  quick: { maxItems: 3, maxTokens: 4000, label: 'gyors' },
  normal: { maxItems: 4, maxTokens: 6000, label: 'normal' },
  detailed: { maxItems: 6, maxTokens: 8000, label: 'reszletes' },
}

function buildPrompt(detailLevel) {
  const { maxItems } = DETAIL_LEVELS[detailLevel] || DETAIL_LEVELS.quick
  return `Te egy utazastervezo. Valaszolj KIZAROLAG valid JSON-nal. Semmi markdown, semmi magyarazat.
Keszits kompakt utitervet a user kerése alapjan.
Rovid magyar szoveget hasznalj. Max ${maxItems} item naponta. Minden note max 120 karakter. Tips max 5.

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

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenced) return fenced[1].trim()
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first !== -1 && last > first) return text.slice(first, last + 1)
  return text.trim()
}

function validateDraft(data) {
  const errors = []
  if (!data || typeof data !== 'object') return { valid: false, errors: ['Nem objektum'] }
  if (!data.title || typeof data.title !== 'string') errors.push('Hianyzo "title"')
  if (!Array.isArray(data.days)) errors.push('Hianyzo vagy ervenytelen "days"')
  if (errors.length > 0) return { valid: false, errors }
  return { valid: true, errors: [] }
}

function trimMessages(messages) {
  const userMessages = messages.filter(m => m.role === 'user')
  if (userMessages.length <= 3) return messages

  const last3 = userMessages.slice(-3)
  const summary = userMessages.slice(0, -3).map(m => m.content).join(' | ')
  return [
    { role: 'user', content: `Korabbi kontextus: ${summary.slice(0, 300)}` },
    ...last3,
  ]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY nincs konfigurálva a szerveren.' })
  }

  const { messages, detailLevel = 'quick' } = req.body || {}
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Hianyzo vagy ures "messages" mezo.' })
  }

  const totalLength = messages.reduce((sum, m) => sum + (m.content?.length || 0), 0)
  if (totalLength > 1500) {
    console.log('[plan-trip] Request too long, trimming messages', { totalLength })
  }

  const level = DETAIL_LEVELS[detailLevel] ? detailLevel : 'quick'
  const { maxTokens } = DETAIL_LEVELS[level]

  console.log('[plan-trip]', {
    model: 'gemini-2.5-flash',
    detailLevel: level,
    messageCount: messages.length,
    promptLength: totalLength,
    maxOutputTokens: maxTokens,
  })

  try {
    const ai = new GoogleGenAI({ apiKey })
    const trimmed = trimMessages(messages)

    const contents = [
      ...trimmed.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [{ text: 'A fenti beszelgetes alapjan generald a kompakt utitervet JSON-ben! A PONTOS SCHEMA-t kovesd, semmi mas szoveg, csak JSON.' }],
      },
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: buildPrompt(level),
        temperature: 0.7,
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
      },
      contents,
    })

    const raw = response.text || ''
    console.log('[plan-trip] Raw response length:', raw.length, 'first 200:', raw.slice(0, 200))

    if (!raw) {
      return res.status(502).json({ error: 'Ures valasz a Gemini-tol.' })
    }

    const jsonStr = extractJson(raw)

    let parsed
    try {
      parsed = JSON.parse(jsonStr)
    } catch (parseErr) {
      console.log('[plan-trip] JSON parse error:', parseErr.message, 'raw:', jsonStr.slice(0, 300))
      return res.status(502).json({ error: 'A Gemini nem adott valid JSON-t.', raw: jsonStr.slice(0, 500) })
    }

    const { valid, errors } = validateDraft(parsed)
    if (!valid) {
      return res.status(502).json({ error: 'A generalt trip JSON nem valid.', details: errors })
    }

    return res.status(200).json({ trip: parsed })
  } catch (err) {
    const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')
    console.log('[plan-trip] Error', { is429, detail: err.message?.slice(0, 200) })

    if (is429) {
      return res.status(429).json({
        error: 'Elerved az ingyenes AI limitet. Probald ujra kesobb, vagy valts Gyors terv modra.',
        retryable: true,
      })
    }
    return res.status(502).json({ error: 'Gemini API hiba.', details: err.message })
  }
}
