# 04 — Gemini backend endpoint

This phase adds the serverless AI endpoint only.

Important:

- No UI integration in this phase.
- Never expose `GEMINI_API_KEY` to frontend code.
- Do not use the `VITE_` prefix for the Gemini key.
- Keep the app Vercel-compatible.
- Run `npm run build` after each task.
- Stop after each task and summarize changed files.

---

## TASK 1 — Create the Gemini planning endpoint

Read only:

- package.json
- .env.example
- api/ (if it exists)
- src/lib/validateTripJson.js (if it exists)

Goal:
Create a Vercel serverless endpoint that converts chat messages into a valid Traveler trip JSON.

Requirements:

1. Create `api/plan-trip.js`.
2. Read `GEMINI_API_KEY` from `process.env`.
3. Accept only POST requests.
4. Request body:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "..."
    }
  ]
}
```

5. Validate the request before calling Gemini.
6. Use Gemini Flash.
7. Prompt Gemini to return ONLY valid JSON.
8. Parse the returned JSON.
9. Validate it using `validateTripJson()` if available.
10. Return:

```json
{
  "trip": { ... }
}
```

11. Handle errors:

- missing API key
- invalid request
- Gemini API failure
- invalid JSON

12. Never expose the API key to frontend code.
13. Add `GEMINI_API_KEY=` to `.env.example`.
14. Do not modify any React UI.

Stop after this task.
Run `npm run build`.

---

## TASK 2 — Make Gemini responses more robust

Goal:
Handle Gemini responses that contain markdown or extra text.

Requirements:

1. Add a helper that extracts JSON from:

- plain JSON
- ```json fenced blocks

  ```
- responses with extra text before/after JSON

2. Never call Gemini twice.
3. Keep the response format unchanged.
4. Do not modify frontend code.

Stop after this task.
Run `npm run build`.
