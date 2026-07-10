import type { SectionConfig, ListSectionKey } from '../src/types/apiServer';
import type { Trip } from '../src/types/trip';
import {
  PackingListResponseSchema,
  UsefulLinksResponseSchema,
  SavingTipsResponseSchema,
  BookingChecklistResponseSchema,
  PracticalInfoResponseSchema,
} from '../src/schemas/ai';
import { tripContext, sectionConfig } from './_suggest-helpers.js';

export const listSectionConfigs: Record<ListSectionKey, SectionConfig> = {
  packingList: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined) {
      const current = (trip.packingList || []).join(', ');
      const extra = instruction?.trim()
        ? `\nExtra instrukció: ${instruction.trim()}`
        : '';
      return `Te egy utazastervezo. Javasolj pakolasi listat az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel (string[]). Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi lista: ${current}` : 'Meg nincs pakolasi lista.'}
${extra}

Adj 10-20 konkret targyat. Magyarul. Csak JSON tomb, semmi mas!`;
    },
    system: 'Valaszolj KIZAROLAG valid JSON tombbel (string[]). Semmi mas szoveg.',
    schema: PackingListResponseSchema,
    format(validated) {
      return {
        suggestion: validated,
        summary: `${validated.length} javasolt tétel a pakolási listához.`,
      };
    },
  }),

  usefulLinks: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined) {
      const current = (trip.usefulLinks || [])
        .map((l) => `${l.emoji} ${l.name}: ${l.desc}`)
        .join('; ');
      const extra = instruction?.trim()
        ? `\nExtra instrukció: ${instruction.trim()}`
        : '';
      return `Te egy utazastervezo. Javasolj hasznos linkeket az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi linkek: ${current}` : 'Meg nincs link lista.'}
${extra}

Adj 5-10 hasznos linket. Minden elem: { "emoji": "🔗", "name": "Nev", "desc": "Leiras", "url": "https://..." }
Hasznalj releváns emoji-t. Csak stabil, letező URL-eket adj (Wikipedia, hivatalos oldalak, Google Maps).
Magyarul. Csak JSON tomb, semmi mas!`;
    },
    system:
      'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { emoji, name, desc, url }. Semmi mas szoveg.',
    schema: UsefulLinksResponseSchema,
    format(validated) {
      return { suggestion: validated, summary: `${validated.length} javasolt link.` };
    },
  }),

  savingTips: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined) {
      const current = (trip.savingTips || [])
        .map((t) => `${t.tip} (${t.saving})`)
        .join('; ');
      const extra = instruction?.trim()
        ? `\nExtra instrukció: ${instruction.trim()}`
        : '';
      return `Te egy utazastervezo. Javasolj penzsporolasi tippeket az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi tippek: ${current}` : 'Meg nincs tipp.'}
${extra}

Adj 5-10 konkret sporolasi tippet. Minden elem: { "tip": "Tipp szoveg", "saving": "~€XX" }
A saving legyen becsult osszeg vagy szazalék. Magyarul. Csak JSON tomb, semmi mas!`;
    },
    system:
      'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { tip, saving }. Semmi mas szoveg.',
    schema: SavingTipsResponseSchema,
    format(validated) {
      return {
        suggestion: validated,
        summary: `${validated.length} javasolt spórolási tipp.`,
      };
    },
  }),

  bookingChecklist: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined) {
      const current = (trip.bookingChecklist || []).map((b) => b.item).join(', ');
      const extra = instruction?.trim()
        ? `\nExtra instrukció: ${instruction.trim()}`
        : '';
      return `Te egy utazastervezo. Javasolj foglalasi checklist elemeket az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi checklist: ${current}` : 'Meg nincs checklist.'}
${extra}

Adj 5-12 fontos foglalasi/szervezesi teendot. Minden elem: { "item": "Teendo szoveg", "url": "", "done": false }
Az url maradhat ures ha nincs ertelmes link. Magyarul. Csak JSON tomb, semmi mas!`;
    },
    system:
      'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { item, url, done }. Semmi mas szoveg.',
    schema: BookingChecklistResponseSchema,
    format(validated) {
      const cleaned = validated.map((b) => ({
        item: b.item,
        url: b.url || '',
        done: false,
      }));
      return {
        suggestion: cleaned,
        summary: `${cleaned.length} javasolt checklist elem.`,
      };
    },
  }),

  practicalInfo: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined) {
      const current = (trip.practicalInfo || [])
        .map((s) => `${s.title}: ${(s.items || []).length} elem`)
        .join('; ');
      const extra = instruction?.trim()
        ? `\nExtra instrukció: ${instruction.trim()}`
        : '';
      return `Te egy utazastervezo. Javasolj praktikus informaciokat az utazashoz.
Valaszolj KIZAROLAG valid JSON tombbel. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${current ? `Jelenlegi szekciok: ${current}` : 'Meg nincs praktikus info.'}
${extra}

Adj 3-6 szekciót, mindegyikben 2-5 praktikus info. Schema:
[{ "title": "Szekció cím", "items": [{ "label": "Kulcs", "value": "Érték" }] }]
Pelda szekciok: Közlekedés, Pénzügy, Hasznos telefonszámok, Időjárás, Kulturális szokások.
Magyarul. Csak JSON tomb, semmi mas!`;
    },
    system:
      'Valaszolj KIZAROLAG valid JSON tombbel. Elemek: { title, items: [{ label, value }] }. Semmi mas szoveg.',
    schema: PracticalInfoResponseSchema,
    format(validated) {
      return { suggestion: validated, summary: `${validated.length} javasolt szekció.` };
    },
  }),
};
