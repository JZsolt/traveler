import type { SectionConfig, SectionExtra, DaySectionKey } from '../src/types/apiServer';
import type { Trip } from '../src/types/trip';
import {
  DayMetaResponseSchema,
  ScheduleItemGuideResponseSchema,
  ScheduleItemResponseSchema,
} from '../src/schemas/ai';
import { tripContext, sectionConfig } from './_suggest-helpers.js';

export const daySectionConfigs: Record<DaySectionKey, SectionConfig> = {
  day: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined, extra?: SectionExtra) {
      const dayNum = extra?.dayNum;
      const day = (trip.days || []).find((d) => d.dayNum === dayNum);
      const ext = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : '';
      return `Te egy utazastervezo. Javasolj cimet es alcimet egy napi programhoz.
Valaszolj KIZAROLAG valid JSON objektummal. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${dayNum}. nap:
Jelenlegi cim: ${day?.title || ''}
Jelenlegi alcim: ${day?.subtitle || ''}
Napi programok: ${(day?.schedule || []).map((s) => s.title).join(', ')}
${ext}

Schema: { "title": "Nap cime", "subtitle": "Rovid leiras" }
A title legyen tomor (3-5 szo), a subtitle irja le a nap hanvgulatat vagy fo programjat.
Magyarul. Csak JSON, semmi mas!`;
    },
    system:
      'Valaszolj KIZAROLAG valid JSON objektummal: { title, subtitle }. Semmi mas szoveg.',
    schema: DayMetaResponseSchema,
    format(validated) {
      return {
        suggestion: {
          title: validated.title,
          subtitle: validated.subtitle || '',
        },
        summary: 'Javasolt nap cím és alcím.',
      };
    },
  }),

  scheduleItemGuide: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined, extra?: SectionExtra) {
      const day = (trip.days || []).find((d) => d.dayNum === extra?.dayNum);
      const item = day?.schedule?.[extra?.itemIndex ?? -1];
      const ext = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : '';
      return `Te egy utazastervezo. Keszits guide informaciot egy latnivalohoz/programponthoz.
Valaszolj KIZAROLAG valid JSON objektummal. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
Program: ${item?.title || ''}
Leiras: ${item?.desc || ''}
Helyszin: ${(item?.links || []).map((l) => l.label).join(', ')}
${ext}

Schema: { "history": ["..."], "mustSee": ["..."], "funFacts": ["..."], "tips": ["..."] }
Minden tomb 2-4 rovid, informativ magyar mondatot tartalmazzon.
A history tortenelmi tenyeket, a mustSee latniivalokat, a funFacts erdekessegeket, a tips praktikus tippeket.
Csak JSON, semmi mas!`;
    },
    system:
      'Valaszolj KIZAROLAG valid JSON objektummal: { history, mustSee, funFacts, tips }. Semmi mas szoveg.',
    schema: ScheduleItemGuideResponseSchema,
    format(validated) {
      return {
        suggestion: {
          history: validated.history || [],
          mustSee: validated.mustSee || [],
          funFacts: validated.funFacts || [],
          tips: validated.tips || [],
        },
        summary: 'Javasolt guide információk.',
      };
    },
  }),

  scheduleItem: sectionConfig({
    buildPrompt(trip: Trip, instruction: string | undefined, extra?: SectionExtra) {
      const day = (trip.days || []).find((d) => d.dayNum === extra?.dayNum);
      const item = day?.schedule?.[extra?.itemIndex ?? -1];
      const otherItems = (day?.schedule || [])
        .filter((_, i) => i !== extra?.itemIndex)
        .map((s) => s.title)
        .join(', ');
      const ext = instruction?.trim() ? `\nExtra instrukció: ${instruction.trim()}` : '';
      return `Te egy utazastervezo. Toltsd ki vagy javitsd egy napi program egy programpontjat.
Valaszolj KIZAROLAG valid JSON objektummal. Semmi markdown, semmi magyarazat.

${tripContext(trip)}
${extra?.dayNum}. nap: ${day?.title || ''}
Tobbi program ezen a napon: ${otherItems || 'nincs meg'}
Jelenlegi programpont: ${item?.title || 'uj, ures'}
Jelenlegi leiras: ${item?.desc || ''}
Jelenlegi ido: ${item?.time || ''}
${ext}

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
- Csak JSON, semmi mas!`;
    },
    system:
      'Valaszolj KIZAROLAG valid JSON objektummal a megadott schema szerint. Semmi mas szoveg.',
    schema: ScheduleItemResponseSchema,
    format(validated) {
      return {
        suggestion: validated,
        summary: `Javasolt program: ${validated.title}`,
      };
    },
  }),
};
