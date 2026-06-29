# 08-06 — Saving Tips Editor

Read only:

- `src/components/trip/SavingTips.jsx`
- `src/components/editor/EditableSection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: inline manual edit for saving tips.

Item shape:

```json
{ "tip": "", "saving": "" }
```

Requirements:

1. Add edit mode to `SavingTips`.
2. Support add/edit/delete/move up/down.
3. Validate `tip` is non-empty.
4. Preserve `savingTipsLabel`.
5. Save updates only `savingTips`.
6. No AI.

Manual test flow to report:

- Add tip.
- Edit saving amount.
- Delete tip.
- Try empty tip and verify UI error.
- Build passes.

Run `pnpm run build`.
