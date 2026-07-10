import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import type { SectionKey, SectionExtra } from '../src/types/apiServer';
import type { Trip } from '../src/types/trip';
import { TripSchema } from '../src/schemas/trip';
import { SuggestSectionRequestSchema } from '../src/schemas/ai';
import { VALID_SECTIONS, SECTION_CONFIG } from './_section-configs.js';
import { errorResponse, extractJson } from './_suggest-helpers.js';
import { getFirstFinishReason, isSectionKey } from './_narrowing.js';

const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

async function handleSection(
  res: VercelResponse,
  section: SectionKey,
  trip: Trip,
  instruction: string | undefined,
  extra: SectionExtra = {},
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return errorResponse(
      res,
      500,
      'GEMINI_API_KEY nincs konfigurálva a szerveren.',
      'AI_SERVER_ERROR',
    );
  }

  const config = SECTION_CONFIG[section];
  const prompt = config.buildPrompt(trip, instruction, extra);

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      config: {
        systemInstruction: config.system,
        temperature: 0.7,
        maxOutputTokens: 4000,
        responseMimeType: 'application/json',
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const raw = response.text || '';

    if (!raw) {
      return errorResponse(res, 502, 'Üres válasz az AI-tól.', 'AI_SERVER_ERROR', true);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const jsonStr = extractJson(raw);
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        const truncated = getFirstFinishReason(response.candidates) === 'MAX_TOKENS';
        return errorResponse(
          res,
          502,
          truncated
            ? 'A válasz túllépte a token limitet és csonka maradt.'
            : 'Az AI nem adott értelmezhető JSON-t.',
          truncated ? 'AI_TOKEN_LIMIT' : 'AI_INVALID_JSON',
          true,
        );
      }
    }

    const validated = config.validate(parsed);
    if (!validated.ok) {
      return errorResponse(
        res,
        502,
        `Az AI válasz formátuma nem megfelelő (${validated.error}).`,
        'AI_INVALID_JSON',
        true,
      );
    }

    return res.status(200).json(validated.format());
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    const is429 = message.includes('429') || message.includes('RESOURCE_EXHAUSTED');

    if (is429) {
      return errorResponse(
        res,
        429,
        'Elérted az AI limitet. Próbáld újra később.',
        'AI_RATE_LIMIT',
        true,
      );
    }
    return errorResponse(res, 502, 'AI szerver hiba.', 'AI_SERVER_ERROR', true);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return errorResponse(
      res,
      405,
      'Csak POST kérés engedélyezett.',
      'AI_INVALID_REQUEST',
    );
  }

  const bodyResult = SuggestSectionRequestSchema.safeParse(req.body || {});
  if (!bodyResult.success) {
    return errorResponse(
      res,
      400,
      'Hiányzó vagy érvénytelen request body.',
      'AI_INVALID_REQUEST',
    );
  }

  const { section, trip, instruction, dayNum, itemIndex } = bodyResult.data;

  if (!isSectionKey(section, VALID_SECTIONS)) {
    return errorResponse(
      res,
      400,
      `Érvénytelen szekció: "${String(section)}". Engedélyezett: ${VALID_SECTIONS.join(', ')}.`,
      'AI_INVALID_REQUEST',
    );
  }

  const tripResult = TripSchema.safeParse(trip);
  if (!tripResult.success) {
    return errorResponse(
      res,
      400,
      'Hiányzó vagy érvénytelen "trip" mező.',
      'AI_INVALID_REQUEST',
    );
  }
  const validTrip: Trip = tripResult.data;

  if (section === 'day' && dayNum === undefined) {
    return errorResponse(
      res,
      400,
      'A "day" szekcióhoz "dayNum" (szám) szükséges.',
      'AI_INVALID_REQUEST',
    );
  }

  if (section === 'scheduleItemGuide' && (dayNum === undefined || itemIndex === undefined)) {
    return errorResponse(
      res,
      400,
      'A "scheduleItemGuide" szekcióhoz "dayNum" és "itemIndex" szükséges.',
      'AI_INVALID_REQUEST',
    );
  }

  if (section === 'scheduleItem' && (dayNum === undefined || itemIndex === undefined)) {
    return errorResponse(
      res,
      400,
      'A "scheduleItem" szekcióhoz "dayNum" és "itemIndex" szükséges.',
      'AI_INVALID_REQUEST',
    );
  }

  const extra: SectionExtra = { dayNum, itemIndex };

  return handleSection(res, section, validTrip, instruction, extra);
}
