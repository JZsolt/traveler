import { GoogleGenAI } from '@google/genai'

const DEFAULT_MODEL = 'gemini-3.1-flash-lite'

const MODELS = {
  'gemini-2.5-flash': true,
  'gemini-3.1-flash-lite': true,
}

const SYSTEM_PROMPT = `Te egy barat, lelkes utazastervezo asszisztens vagy. Magyarul beszelsz.

A felhasznalo utazast tervez es te segitesz neki brainstormolni. A celod:
- Kerdezz vissza: hova, mikor, hany fore, milyen budget, milyen programok erdeklik
- Javasolj utvonalakat, helyszineket, programokat
- Ha kevés infot adott, kerdezz ra a reszletekre
- Legy rovid es lenyegretoro, max 2-3 mondat valaszonkent
- Ha mar eleg info osszegyult, ird meg roviden mit javasolsz es mondd hogy nyomja meg a "Terv generalasa" gombot

NE generalj JSON-t, NE irj strukturalt trip tervet. Csak beszelgess es segits az otletelesben.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY nincs konfigurálva.' })
  }

  const { messages, model: requestedModel } = req.body || {}
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Hianyzo "messages" mezo.' })
  }

  const model = MODELS[requestedModel] ? requestedModel : DEFAULT_MODEL

  try {
    const ai = new GoogleGenAI({ apiKey })

    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
      },
      contents,
    })

    return res.status(200).json({ reply: response.text })
  } catch (err) {
    return res.status(502).json({ error: 'Gemini API hiba.', details: err.message })
  }
}
