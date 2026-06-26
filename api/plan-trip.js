import { GoogleGenAI } from '@google/genai'

const TEMPLATE = `{
  "slug": "varos-2026",
  "title": "Varos1 · Varos2",
  "subtitle": "2026. honap dd–dd.",
  "emoji": "🇭🇺 🏛",
  "startDate": "2026-01-01",
  "endDate": "2026-01-03",
  "people": "4 felnott · 2 hazaspar",
  "highlights": ["Latnivalo 1", "Latnivalo 2"],
  "accommodation": { "address": "Utca 1, Varos", "mapUrl": "https://maps.google.com/?q=...", "host": "Szallas neve" },
  "flight": { "airport": "Repuloter (KOD)", "arrival": "honap dd. ido", "departure": "honap dd. ido" },
  "budget": {
    "lowPerFamily": "~€XXX", "comfortPerFamily": "~€XXX",
    "lowTotal": "~€XXX", "comfortTotal": "~€XXX",
    "lowPerFamilyLabel": "Sporolos / 1 csalad", "comfortPerFamilyLabel": "Kenyelmesebb / 1 csalad",
    "lowTotalLabel": "Sporolos osszesen", "comfortTotalLabel": "Kenyelmesebb osszesen",
    "headline": "~€XXX-XXX / X fo", "summaryLabel": "Teljes ut becslese"
  },
  "urgentBookings": [{ "name": "Foglalas neve", "reason": "Miert surgos", "url": "https://...", "done": false }],
  "usefulLinks": [{ "emoji": "🏛", "name": "Link neve", "desc": "Leiras", "url": "https://..." }],
  "packingList": ["Kenyelmes cipo", "Powerbank"],
  "savingTips": [{ "tip": "Tipp", "saving": "~€XX" }],
  "practicalInfo": [{ "title": "Szekcio", "items": ["Info 1"] }],
  "bookingChecklist": [{ "item": "Teendo", "url": "https://..." }],
  "overview": [{ "day": 1, "date": "Hon. dd (nap)", "program": "🏛 Napi cim", "highlights": "Fobb programok" }],
  "days": [{
    "dayNum": 1, "title": "Nap cime", "subtitle": "Honap dd. napnev",
    "tickets": [], "images": [{ "url": "https://upload.wikimedia.org/...", "caption": "Kep leirasa" }],
    "alerts": [{ "type": "tip", "text": "Tipp" }],
    "schedule": [{
      "time": "10:00", "title": "🏛 Hely neve", "desc": "Leiras.", "highlight": true,
      "badges": ["INGYENES"],
      "links": [{ "label": "📍 Terkep", "url": "https://maps.google.com/?q=..." }, { "label": "Wikipedia", "url": "https://hu.wikipedia.org/wiki/..." }],
      "transport": [{ "type": "walk", "label": "🚶 ~X perc seta", "url": "https://..." }],
      "guide": { "history": ["Tortenelmi teny."], "mustSee": ["Latnivalo."], "funFacts": ["Erdekesseg."], "tips": ["Tipp."] }
    }],
    "costs": [{ "item": "Belepok", "cost": "~€XX" }, { "item": "Nap osszesen", "cost": "~€XX", "total": true }],
    "endAlerts": []
  }]
}`

const SYSTEM_PROMPT = `Te egy utazastervezo AI vagy. A felhasznalo utazasi terveket ker toled.

FONTOS SZABALYOK:
- Valaszolj KIZAROLAG egyetlen valid JSON objektummal, semmi mas szoveg ne legyen a valaszban.
- A JSON-nek PONTOSAN az alabbi sablont kell kovetnie, minden mezot kitoltve.
- Minden szoveg MAGYAR nyelvu legyen.
- Minden POI-hoz kell Google Maps link + Wikipedia/hivatalos oldal link.
- Minden latnivalosaghoz kell guide (history, mustSee, funFacts, tips).
- Etkezesekhez: etterem ajanlatok Google ratinggel es cimmel.
- Kepek: Wikimedia Commons URL-ek.
- Koltsegek (costs) mindig az OSSZES utazora vonatkoznak, nem fejenkent.
- Tipografiai idezőjelek TILOSAK — hasznalj aposztrófot (') vagy sima idezojelet.
- A subtitle mezo a datum formatumban: "2026. julius 21–24."
- Naponta 4-8 schedule item legyen (POI-k, etkezesek, opcionalisok).
- Az emoji mezo az orszag zaszlaja legyen.

JSON SABLON (kovetendő struktura):
${TEMPLATE}`

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenced) return fenced[1].trim()

  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first !== -1 && last > first) return text.slice(first, last + 1)

  return text.trim()
}

function validateTrip(data) {
  const errors = []
  if (!data || typeof data !== 'object') return { valid: false, errors: ['Nem objektum'] }
  if (!data.title || typeof data.title !== 'string') errors.push('Hianyzo "title"')
  if (!data.startDate) errors.push('Hianyzo "startDate"')
  if (!data.endDate) errors.push('Hianyzo "endDate"')
  if (data.days !== undefined && !Array.isArray(data.days)) errors.push('"days" nem tomb')
  if (errors.length > 0) return { valid: false, errors }
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }
  if (!Array.isArray(data.highlights)) data.highlights = []
  if (!Array.isArray(data.days)) data.days = []
  return { valid: true, errors: [] }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY nincs konfigurálva a szerveren.' })
  }

  const { messages } = req.body || {}
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Hianyzo vagy ures "messages" mezo.' })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
      contents,
    })

    const raw = response.text
    const jsonStr = extractJson(raw)

    let parsed
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      return res.status(502).json({ error: 'A Gemini nem adott valid JSON-t.', raw: jsonStr.slice(0, 500) })
    }

    const { valid, errors } = validateTrip(parsed)
    if (!valid) {
      return res.status(502).json({ error: 'A generalt trip JSON nem valid.', details: errors })
    }

    return res.status(200).json({ trip: parsed })
  } catch (err) {
    return res.status(502).json({ error: 'Gemini API hiba.', details: err.message })
  }
}
