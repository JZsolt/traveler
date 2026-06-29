# 08-08 — Practical Info Editor

Read only:

- `src/components/trip/PracticalInfo.jsx`
- `src/components/editor/EditableSection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: inline manual edit for practical info.

Section shape:

```json
{ "title": "", "items": [""] }
```

Requirements:

1. Add edit mode to `PracticalInfo`.
2. Support add/edit/delete/move sections.
3. Inside a section support add/edit/delete/move item strings.
4. Validate section title is non-empty.
5. Save updates only `practicalInfo`.
6. Preserve collapsible view behavior.
7. No AI.

Manual test flow to report:

- Add section.
- Add multiple items.
- Save and confirm collapsible output.
- Try empty title and verify UI error.
- Build passes.

Run `pnpm run build`.
