# 08-19 — Section AI Endpoint Skeleton

Read only:

- `api/plan-trip.js`
- `api/expand-day.js`
- `src/data/trips/_template.json`

Goal: create server-only endpoint skeleton for section suggestions.

Requirements:

1. Create `api/suggest-trip-section.js`.
2. Read `GEMINI_API_KEY` from `process.env`.
3. Accept POST only.
4. Validate `section` is one of `packingList`, `usefulLinks`, `savingTips`, `practicalInfo`, `bookingChecklist`.
5. Validate `trip` exists.
6. Validate optional `instruction` is string.
7. Define standard error shape:

```json
{
  "error": "Hungarian user-facing message",
  "code": "AI_RATE_LIMIT | AI_TOKEN_LIMIT | AI_INVALID_JSON | AI_SERVER_ERROR | AI_INVALID_REQUEST",
  "retryable": true
}
```

8. Return placeholder 501 after validation:

```json
{ "error": "Még nincs implementálva.", "code": "AI_SERVER_ERROR", "retryable": false }
```

9. Do not call Gemini yet.
10. Do not change frontend.

Manual test flow to report:

- Invalid method.
- Invalid section.
- Missing trip.
- Valid request returns placeholder.
- Build passes.

Run `pnpm run build`.
