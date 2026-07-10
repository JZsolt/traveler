import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import type { GeminiModels } from '../src/types/apiServer';
import { ExpandDayResponseSchema } from '../src/schemas/ai';
import { formatZodError } from '../src/schemas/errors';
import { asRecordArray, getFirstFinishReason, isRecord } from './_narrowing';

const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

const MODELS: GeminiModels = {
  'gemini-2.5-flash': true,
  'gemini-3.1-flash-lite': true,
};

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
- Csak JSON, semmi mas!`;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) return fenced[1].trim();
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last > first) return text.slice(first, last + 1);
  return text.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY nincs konfigurálva.' });
  }

  const body: unknown = req.body || {};
  if (!isRecord(body)) {
    return res.status(400).json({ error: 'Hianyzo request body.' });
  }

  const tripTitle = body.tripTitle;
  const destination = body.destination;
  const dayNumber = body.dayNumber;
  const currentDay = body.currentDay;
  const people = body.people;
  const requestedModel = body.model;
  const instruction = typeof body.instruction === 'string' ? body.instruction : '';

  if (
    typeof tripTitle !== 'string' ||
    typeof dayNumber !== 'number' ||
    !isRecord(currentDay)
  ) {
    return res
      .status(400)
      .json({ error: 'Hianyzo mezok: tripTitle, dayNumber, currentDay.' });
  }

  const model =
    typeof requestedModel === 'string' && MODELS[requestedModel]
      ? requestedModel
      : DEFAULT_MODEL;
  console.log('[expand-day]', { model, tripTitle, dayNumber, destination });

  const dayItems = asRecordArray(currentDay.items);
  const items = dayItems
    .map((i) => `${i.time || ''} ${i.title || ''} (${i.type || ''}) - ${i.note || ''}`)
    .join('; ');
  const dest = typeof destination === 'string' ? destination : '';
  const ppl = typeof people === 'string' ? people : '';
  const userPrompt = `Utazas: ${tripTitle}
Cel: ${dest}
Utazok: ${ppl}
${dayNumber}. nap vazlata:
Cim: ${currentDay.title || ''}
Osszefoglalo: ${currentDay.summary || ''}
Programok: ${items}
${instruction.trim() ? `\nKulon user instrukcio:\n${instruction.trim()}\n` : ''}

Reszletezd ki ezt a napot!`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 10000,
        responseMimeType: 'application/json',
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    });

    const raw = response.text || '';
    const finishReason = getFirstFinishReason(response.candidates);
    console.log(
      '[expand-day] Raw response length:',
      raw.length,
      'finishReason:',
      finishReason,
    );

    if (!raw) {
      return res.status(502).json({ error: 'Ures valasz a Gemini-tol.' });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const jsonStr = extractJson(raw);
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseErr) {
        const truncated = finishReason === 'MAX_TOKENS';
        const msg = parseErr instanceof Error ? parseErr.message : 'Unknown';
        console.log('[expand-day] JSON parse error:', msg, 'truncated:', truncated);
        return res.status(502).json({
          error: truncated
            ? 'A valasz tullepte a token limitet. Probald ujra.'
            : 'Nem sikerult ertelmezni a valaszt.',
          raw: raw.slice(0, 500),
          retryable: true,
        });
      }
    }

    const validated = ExpandDayResponseSchema.safeParse(parsed);
    if (!validated.success) {
      console.log('[expand-day] Validation failed:', formatZodError(validated.error));
      return res
        .status(502)
        .json({
          error: 'Hianyzo vagy ervenytelen "schedule" a valaszban.',
          retryable: true,
        });
    }

    const day = { ...validated.data, dayNum: dayNumber };

    return res.status(200).json({ day });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    const is429 = message.includes('429') || message.includes('RESOURCE_EXHAUSTED');
    console.log('[expand-day] Error', { is429, detail: message.slice(0, 200) });

    if (is429) {
      return res.status(429).json({
        error: 'AI limit elerve. Probald ujra kesobb.',
        retryable: true,
      });
    }
    return res.status(502).json({ error: 'Gemini API hiba.', details: message });
  }
}
