import type { SectionConfig, ListSectionKey } from '../src/types/apiServer'
import type { Trip } from '../src/types/trip'
import { tripContext } from './_suggest-helpers'
import { isRecord, asString, asStringArray, asRecordArray } from './_narrowing'

export const listSectionConfigs: Record<ListSectionKey, SectionConfig> = {
  packingList: {
    buildPrompt(trip: Trip, instruction: string | undefined) {
      const current = (trip.packingList || []).join(', ')
      const extra = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : ''
      return `Te egy utazastervezo. Javasolj pakolasi listat az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel (string[]). Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi lista: ${current}` : 'Meg nincs pakolasi lista.'}
${extra}

Adj 10-20 konkret targyat. Magyarul. Csak JSON tomb, semmi mas!`
    },
    system: 'Valaszolj KIZAROLAG valid JSON tombbel (string[]). Semmi mas szoveg.',
    validate(parsed: unknown) {
      if (!Array.isArray(parsed) || !parsed.every(i => typeof i === 'string')) return 'string tömb kell'
      return null
    },
    format(parsed: unknown) {
      const arr = asStringArray(parsed)
      return { suggestion: arr, summary: `${arr.length} javasolt tétel a pakolási listához.` }
    },
  },

  usefulLinks: {
    buildPrompt(trip: Trip, instruction: string | undefined) {
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
    validate(parsed: unknown) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const item of parsed) {
        if (!isRecord(item) || typeof item.name !== 'string') return 'minden elemnek kell "name"'
      }
      return null
    },
    format(parsed: unknown) {
      const cleaned = asRecordArray(parsed).map(l => ({
        emoji: asString(l.emoji, '🔗'),
        name: asString(l.name),
        desc: asString(l.desc),
        url: asString(l.url),
      }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt link.` }
    },
  },

  savingTips: {
    buildPrompt(trip: Trip, instruction: string | undefined) {
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
    validate(parsed: unknown) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const item of parsed) {
        if (!isRecord(item) || typeof item.tip !== 'string') return 'minden elemnek kell "tip"'
      }
      return null
    },
    format(parsed: unknown) {
      const cleaned = asRecordArray(parsed).map(t => ({ tip: asString(t.tip), saving: asString(t.saving) }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt spórolási tipp.` }
    },
  },

  bookingChecklist: {
    buildPrompt(trip: Trip, instruction: string | undefined) {
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
    validate(parsed: unknown) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const item of parsed) {
        if (!isRecord(item) || typeof item.item !== 'string') return 'minden elemnek kell "item"'
      }
      return null
    },
    format(parsed: unknown) {
      const cleaned = asRecordArray(parsed).map(b => ({ item: asString(b.item), url: asString(b.url), done: false }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt checklist elem.` }
    },
  },

  practicalInfo: {
    buildPrompt(trip: Trip, instruction: string | undefined) {
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
    validate(parsed: unknown) {
      if (!Array.isArray(parsed)) return 'tömb kell'
      for (const s of parsed) {
        if (!isRecord(s) || typeof s.title !== 'string' || !Array.isArray(s.items)) return 'minden szekciónak kell "title" és "items" tömb'
      }
      return null
    },
    format(parsed: unknown) {
      const cleaned = asRecordArray(parsed).map(s => ({
        title: asString(s.title),
        items: asRecordArray(s.items).map(i => ({ label: asString(i.label), value: asString(i.value) })),
      }))
      return { suggestion: cleaned, summary: `${cleaned.length} javasolt szekció.` }
    },
  },
}
