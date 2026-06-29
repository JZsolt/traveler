import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `Te egy utazastervezo. Valaszolj KIZAROLAG valid JSON-nal. Semmi markdown, semmi magyarazat.
Kapod egy utazas egy napjanak vazlatat. Reszletezd ki teljes napi tervve.

Valasz SCHEMA:
{
  "dayNum": number,
  "title": "Nap cime",
  "subtitle": "Honap dd. napnev — rovid leiras",
  "schedule": [
    {
      "time": "10:00",
      "title": "🏛 Hely neve",
      "desc": "Rovid informativ leiras.",
      "highlight": true,
      "badges": [],
      "links": [
        { "label": "📍 Terkep", "url": "https://maps.google.com/?q=..." },
        { "label": "Wikipedia", "url": "https://hu.wikipedia.org/wiki/..." }
      ],
      "guide": {
        "history": ["Tortenelmi teny."],
        "mustSee": ["Latnivalo."],
        "tips": ["Tipp."]
      }
    }
  ],
  "costs": [
    { "item": "Napi becsult koltseg", "cost": "~€XX", "total": true }
  ]
}

Szabalyok:
- Magyar szoveg
- 4-8 schedule item (latnivalok, etkezesek, opcionalis programok)
- Minden POI-hoz Google Maps link
- Etkezesekhez etterem ajanlat
- Guide history/mustSee/tips ahol releváns
- Emoji-k a title-okben (🏛 🍽 🎨 🚶 stb.)
- Tipografiai idezőjelek TILOSAK
- Csak JSON, semmi mas!`

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenced) return fenced[1].trim()
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first !== -1 && last > first) return text.slice(first, last + 1)
  return text.trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY nincs konfigurálva.' })
  }

  const { tripTitle, destination, dayNumber, currentDay, people } = req.body || {}
  if (!tripTitle || !dayNumber || !currentDay) {
    return res.status(400).json({ error: 'Hianyzo mezok: tripTitle, dayNumber, currentDay.' })
  }

  console.log('[expand-day]', { tripTitle, dayNumber, destination })

  const userPrompt = `Utazas: ${tripTitle}
Cel: ${destination || ''}
Utazok: ${people || ''}
${dayNumber}. nap vazlata:
Cim: ${currentDay.title}
Osszefoglalo: ${currentDay.summary || ''}
Programok: ${(currentDay.items || []).map(i => `${i.time || ''} ${i.title} (${i.type}) - ${i.note || ''}`).join('; ')}

Reszletezd ki ezt a napot!`

  try {
    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 6000,
        responseMimeType: 'application/json',
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    })

    const raw = response.text || ''
    console.log('[expand-day] Raw response length:', raw.length)

    if (!raw) {
      return res.status(502).json({ error: 'Ures valasz a Gemini-tol.' })
    }

    const jsonStr = extractJson(raw)

    let parsed
    try {
      parsed = JSON.parse(jsonStr)
    } catch (parseErr) {
      console.log('[expand-day] JSON parse error:', parseErr.message, 'raw:', jsonStr.slice(0, 300))
      return res.status(502).json({ error: 'Nem sikerult ertelmezni a valaszt.', raw: jsonStr.slice(0, 500) })
    }

    if (!parsed.schedule || !Array.isArray(parsed.schedule)) {
      return res.status(502).json({ error: 'Hianyzo "schedule" a valaszban.' })
    }

    parsed.dayNum = dayNumber

    return res.status(200).json({ day: parsed })
  } catch (err) {
    const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')
    console.log('[expand-day] Error', { is429, detail: err.message?.slice(0, 200) })

    if (is429) {
      return res.status(429).json({
        error: 'AI limit elerve. Probald ujra kesobb.',
        retryable: true,
      })
    }
    return res.status(502).json({ error: 'Gemini API hiba.', details: err.message })
  }
}
