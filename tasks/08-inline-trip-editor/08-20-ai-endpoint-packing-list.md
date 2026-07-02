# 08-20 — AI Endpoint For PackingList ✅ DONE

Read only:

- `api/suggest-trip-section.js`
- `api/plan-trip.js`

Goal: implement Gemini suggestion for `packingList` only.

Requirements:

1. Call Gemini only for `section === "packingList"`.
2. Prompt returns only JSON string array.
3. Include trip title, dates, people, current packing list and optional instruction.
4. Parse response.
5. Validate response is `string[]`.
6. Return:

```json
{ "suggestion": ["..."], "summary": "Rövid magyar összefoglaló" }
```

7. Return user-facing standard errors for missing key, 429, token limit, invalid JSON, invalid shape.
8. Console logs are only extra debug detail.
9. No frontend changes.

Manual test flow to report:

- Happy path with API key.
- Missing API key.
- 429/rate limit behavior.
- Token limit/truncated response behavior.
- Invalid JSON/shape behavior.
- Build passes.

Do not write automated tests.
Run `pnpm run build`.
