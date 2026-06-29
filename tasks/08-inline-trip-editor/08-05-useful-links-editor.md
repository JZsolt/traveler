# 08-05 — Useful Links Editor

Read only:

- `src/components/trip/UsefulLinks.jsx`
- `src/components/editor/EditableSection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: inline manual edit for useful links.

Item shape:

```json
{ "emoji": "🔗", "name": "", "desc": "", "url": "" }
```

Requirements:

1. Add edit mode to `UsefulLinks`.
2. Support add/edit/delete/move up/down.
3. Validate `name` is non-empty.
4. `url` can be empty but must remain a string.
5. Save updates only `usefulLinks`.
6. No AI.

Manual test flow to report:

- Add link.
- Edit URL/description.
- Save and verify rendered link.
- Try empty name and verify UI error.
- Build passes.

Run `pnpm run build`.
