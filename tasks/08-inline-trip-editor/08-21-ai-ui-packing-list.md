# 08-21 — AI UI For PackingList

Read only:

- `src/components/trip/PackingList.jsx`
- `src/components/editor/EditableSection.jsx`
- `api/suggest-trip-section.js`

Goal: prove AI suggestion UX on the smallest section.

Requirements:

1. Add `AI kiegészítés` in PackingList edit mode.
2. User can type optional instruction.
3. Call `/api/suggest-trip-section` with `section: "packingList"`.
4. Show preview of returned list.
5. User can apply suggestion into edit form.
6. User can discard suggestion.
7. Do not auto-save.
8. Save remains manual.
9. Show AI loading and AI errors inside PackingList edit UI.
10. Retry keeps instruction text and unsaved manual edits.
11. User never needs DevTools console to understand failure.

Manual test flow to report:

- Happy path.
- Missing API key/server error.
- 429/rate limit.
- Token limit/truncated response.
- Invalid JSON/invalid shape.
- Retry with edited instruction.
- Apply suggestion then Save.
- Apply suggestion then Cancel.
- Build passes.

Do not write automated tests.
Run `pnpm run build`.
