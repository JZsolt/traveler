/* global process */
import { GoogleGenAI } from '@google/genai'

const DEFAULT_MODEL = 'gemini-3.1-flash-lite'

const VALID_SECTIONS = ['packingList', 'usefulLinks', 'savingTips', 'practicalInfo', 'bookingChecklist', 'day', 'scheduleItemGuide', 'scheduleItem']

function errorResponse(res, status, message, code, retryable = false) {
  return res.status(status).json({ error: message, code, retryable })
}

function extractJson(text) {
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

function tripContext(trip) {
  return `Utazas: ${trip.title || ''}
Cel: ${trip.destination || trip.title || ''}
Datum: ${trip.startDate || ''} - ${trip.endDate || ''}
Utazok: ${trip.people || ''}`
}

const SECTION_CONFIG = {
  packingList: {
    buildPrompt(trip, instruction) {
      const current = (trip.packingList || []).join(', ')
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Keszits pakolasi listat.
Valaszolj KIZAROLAG valid JSON tombbel (string[]). Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi lista: ${current}` : 'Meg nincs lista.'}
${extra}

Adj 15-25 praktikus pakolnivalot. Figyelj az idojarasra, a cel kulturajara, es az utazok osszetételere.
Rovid tetelek (max 3-4 szo), magyarul.
Csak JSON tomb, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON tombbel (string[]). Semmi mas szoveg.',
    validate(parsed) {
      if (!Array.isArray(parsed) || !parsed.every(i => typeof i === 'string')) return 'string tömb kell'
      return null
    },
    format(parsed) {
      return { suggestion: parsed, summary: `${parsed.length} javasolt tétel a pakolási listához.` }
    },
  },

  usefulLinks: {
    buildPrompt(trip, instruction) {
      const current = (trip.usefulLinks || []).map(l => `${l.emoji} ${l.name}: ${l.desc}`).join('; ')
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Javasolj hasznos linkeket az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi linkek: ${current}` : 'Meg nincs link lista.'}
${extra}

Adj 5-10 hasznos linket. Minden elem: { "emoji": "🔗", "name": "Nev", "desc": "Leiras", "url": "https://..." }
Hasznalj releváns emoji-t. Csak stabil, letező URL-eket adj (Wikipedia, hivatalos oldalak, Google Maps).
Magyarul. Csak JSON tomb, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { emoji, name, desc, url }. Semmi mas szoveg.',
    validate(parsed) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const item of parsed) {
        if (!item || typeof item !== 'object' || !item.name) return 'minden elemnek kell "name"'
      }
      return null
    },
    format(parsed) {
      const cleaned = parsed.map(l => ({
        emoji: l.emoji || '🔗',
        name: l.name,
        desc: l.desc || '',
        url: l.url || '',
      }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt link.` }
    },
  },

  savingTips: {
    buildPrompt(trip, instruction) {
      const current = (trip.savingTips || []).map(t => `${t.tip} (${t.saving})`).join('; ')
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Javasolj penzsporolasi tippeket az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi tippek: ${current}` : 'Meg nincs tipp.'}
${extra}

Adj 5-10 konkret sporolasi tippet. Minden elem: { "tip": "Tipp szoveg", "saving": "~€XX" }
A saving legyen becsult osszeg vagy szazalék. Magyarul. Csak JSON tomb, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { tip, saving }. Semmi mas szoveg.',
    validate(parsed) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const item of parsed) {
        if (!item || typeof item !== 'object' || !item.tip) return 'minden elemnek kell "tip"'
      }
      return null
    },
    format(parsed) {
      const cleaned = parsed.map(t => ({ tip: t.tip, saving: t.saving || '' }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt spórolási tipp.` }
    },
  },

  bookingChecklist: {
    buildPrompt(trip, instruction) {
      const current = (trip.bookingChecklist || []).map(b => b.item).join(', ')
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Javasolj foglalasi checklist elemeket az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi checklist: ${current}` : 'Meg nincs checklist.'}
${extra}

Adj 5-12 fontos foglalasi/szervezesi teendot. Minden elem: { "item": "Teendo szoveg", "url": "", "done": false }
Az url maradhat ures ha nincs ertelmes link. Magyarul. Csak JSON tomb, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { item, url, done }. Semmi mas szoveg.',
    validate(parsed) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const item of parsed) {
        if (!item || typeof item !== 'object' || !item.item) return 'minden elemnek kell "item"'
      }
      return null
    },
    format(parsed) {
      const cleaned = parsed.map(b => ({ item: b.item, url: b.url || '', done: false }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt checklist elem.` }
    },
  },

  practicalInfo: {
    buildPrompt(trip, instruction) {
      const current = (trip.practicalInfo || []).map(s => `${s.title}: ${(s.items || []).length} elem`).join('; ')
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Javasolj praktikus informaciokat az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi szekciok: ${current}` : 'Meg nincs praktikus info.'}
${extra}

Adj 3-6 szekciót, mindegyikben 2-5 praktikus info. Schema:
[{ "title": "Szekció cím", "items": [{ "label": "Kulcs", "value": "Érték" }] }]
Pelda szekciok: Közlekedés, Pénzügy, Hasznos telefonszámok, Időjárás, Kulturális szokások.
Magyarul. Csak JSON tomb, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { title, items: [{ label, value }] }. Semmi mas szoveg.',
    validate(parsed) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const s of parsed) {
        if (!s || typeof s !== 'object' || !s.title || !Array.isArray(s.items)) return 'minden szekciónak kell "title" és "items" tömb'
      }
      return null
    },
    format(parsed) {
      const cleaned = parsed.map(s => ({
        title: s.title,
        items: (s.items || []).map(i => ({ label: i.label || '', value: i.value || '' })),
      }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt szekció.` }
    },
  },

  day: {
    buildPrompt(trip, instruction, { dayNum } = {}) {
      const day = (trip.days || []).find(d => d.dayNum === dayNum)
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Javasolj cimet es alcimet egy napi programhoz.
Valaszolj KIZAROLAG valid JSON objektummal. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${dayNum}. nap:
Jelenlegi cim: ${day?.title || ''}
Jelenlegi alcim: ${day?.subtitle || ''}
Napi programok: ${(day?.schedule || []).map(s => s.title).join(', ')}
${extra}

Schema: { "title": "Nap cime", "subtitle": "Rovid leiras" }
A title legyen tomor (3-5 szo), a subtitle irja le a nap hanvgulatat vagy fo programjat.
Magyarul. Csak JSON, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON objektummal: { title, subtitle }. Semmi mas szoveg.',
    validate(parsed) {
      if (!parsed || typeof parsed !== 'object') return 'objektum kell'
      if (typeof parsed.title !== 'string') return 'kell "title" string'
      return null
    },
    format(parsed) {
      return {
        suggestion: { title: parsed.title, subtitle: parsed.subtitle || '' },
        summary: 'Javasolt nap cím és alcím.',
      }
    },
  },

  scheduleItemGuide: {
    buildPrompt(trip, instruction, { dayNum, itemIndex } = {}) {
      const day = (trip.days || []).find(d => d.dayNum === dayNum)
      const item = day?.schedule?.[itemIndex]
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Keszits guide informaciot egy latnivalohoz/programponthoz.
Valaszolj KIZAROLAG valid JSON objektummal. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
Program: ${item?.title || ''}
Leiras: ${item?.desc || ''}
Helyszin: ${(item?.links || []).map(l => l.label).join(', ')}
${extra}

Schema: { "history": ["..."], "mustSee": ["..."], "funFacts": ["..."], "tips": ["..."] }
Minden tomb 2-4 rovid, informativ magyar mondatot tartalmazzon.
A history tortenelmi tenyeket, a mustSee latniivalokat, a funFacts erdekessegeket, a tips praktikus tippeket.
Csak JSON, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON objektummal: { history, mustSee, funFacts, tips }. Semmi mas szoveg.',
    validate(parsed) {
      if (!parsed || typeof parsed !== 'object') return 'objektum kell'
      for (const key of ['history', 'mustSee', 'funFacts', 'tips']) {
        if (parsed[key] && !Array.isArray(parsed[key])) return `"${key}" tömbnek kell lennie`
      }
      return null
    },
    format(parsed) {
      return {
        suggestion: {
          history: parsed.history || [],
          mustSee: parsed.mustSee || [],
          funFacts: parsed.funFacts || [],
          tips: parsed.tips || [],
        },
        summary: 'Javasolt guide információk.',
      }
    },
  },

  scheduleItem: {
    buildPrompt(trip, instruction, { dayNum, itemIndex } = {}) {
      const day = (trip.days || []).find(d => d.dayNum === dayNum)
      const item = day?.schedule?.[itemIndex]
      const otherItems = (day?.schedule || []).filter((_, i) => i !== itemIndex).map(s => s.title).join(', ')
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Toltsd ki vagy javitsd egy napi program egy programpontjat.
Valaszolj KIZAROLAG valid JSON objektummal. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${dayNum}. nap: ${day?.title || ''}
Tobbi program ezen a napon: ${otherItems || 'nincs meg'}
Jelenlegi programpont: ${item?.title || 'uj, ures'}
Jelenlegi leiras: ${item?.desc || ''}
Jelenlegi ido: ${item?.time || ''}
${extra}

Schema:
{
  "time": "10:00",
  "title": "Program neve",
  "desc": "Rovid informativ leiras (1-2 mondat).",
  "highlight": false,
  "optional": false,
  "badges": ["INGYENES"],
  "links": [
    { "label": "📍 Térkép", "url": "https://maps.google.com/?q=..." },
    { "label": "Wikipedia", "url": "https://hu.wikipedia.org/wiki/..." }
  ],
  "transport": [],
  "guide": {
    "history": ["Tortenelmi teny."],
    "mustSee": ["Latnivalo."],
    "funFacts": ["Erdekesseg."],
    "tips": ["Tipp."]
  }
}

Szabalyok:
- Magyar szoveg
- Google Maps link a helyszinhez (ha van ertelme)
- Wikipedia link (ha van releváns cikk)
- Guide mezok: 2-3 rovid mondat kategoriankent
- badges: INGYENES ha ingyenes, GYEREKBARÁT ha releváns
- Csak JSON, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON objektummal a megadott schema szerint. Semmi mas szoveg.',
    validate(parsed) {
      if (!parsed || typeof parsed !== 'object') return 'objektum kell'
      if (typeof parsed.title !== 'string' || !parsed.title) return 'kell "title" string'
      return null
    },
    format(parsed) {
      return {
        suggestion: {
          time: parsed.time || '',
          title: parsed.title,
          desc: parsed.desc || '',
          highlight: !!parsed.highlight,
          optional: !!parsed.optional,
          badges: Array.isArray(parsed.badges) ? parsed.badges : [],
          links: Array.isArray(parsed.links) ? parsed.links.map(l => ({ label: l.label || '', url: l.url || '' })) : [],
          transport: Array.isArray(parsed.transport) ? parsed.transport : [],
          guide: {
            history: parsed.guide?.history || [],
            mustSee: parsed.guide?.mustSee || [],
            funFacts: parsed.guide?.funFacts || [],
            tips: parsed.guide?.tips || [],
          },
        },
        summary: `Javasolt program: ${parsed.title}`,
      }
    },
  },
}

async function handleSection(res, section, trip, instruction, extra = {}) {
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

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      const jsonStr = extractJson(raw)
      try {
        parsed = JSON.parse(jsonStr)
      } catch {
        const truncated = response.candidates?.[0]?.finishReason === 'MAX_TOKENS'
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
    const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')

    if (is429) {
      return errorResponse(res, 429, 'Elérted az AI limitet. Próbáld újra később.', 'AI_RATE_LIMIT', true)
    }
    return errorResponse(res, 502, 'AI szerver hiba.', 'AI_SERVER_ERROR', true)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Csak POST kérés engedélyezett.', 'AI_INVALID_REQUEST')
  }

  const { section, trip, instruction, dayNum, itemIndex } = req.body || {}

  if (!section || !VALID_SECTIONS.includes(section)) {
    return errorResponse(res, 400, `Érvénytelen szekció: "${section}". Engedélyezett: ${VALID_SECTIONS.join(', ')}.`, 'AI_INVALID_REQUEST')
  }

  if (!trip || typeof trip !== 'object') {
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

  return handleSection(res, section, trip, instruction, { dayNum, itemIndex })
}
