# 08-03 — Editable Section Shell

Read only:

- `src/components/ui/button.jsx`

Goal: create reusable edit shell UI, not wired to trip data yet.

Requirements:

1. Create `src/components/editor/EditableSection.jsx`.
2. Props: `title`, `children`, `editor`, `onSave`, `onCancel`, `saving`, `error`, `canUseAi`, `onAi`.
3. View mode shows children + Edit button.
4. Edit mode shows editor + Save/Cancel buttons.
5. If `canUseAi`, show `AI kiegészítés` in edit mode.
6. Use real buttons and disabled states.
7. Compact mobile-friendly styling.
8. Do not use nested cards.
9. Do not wire into TripPage yet.

Manual test flow to report:

- Build passes.
- No visible app changes expected.
- Explain how future tasks will use this component.

Run `pnpm run build`.
