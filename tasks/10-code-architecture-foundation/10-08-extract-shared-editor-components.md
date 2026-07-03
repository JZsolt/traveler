# 10-08 — Extract Shared Editor Components

Read only:

- `src/components/editor/`
- `src/components/trip/`
- `src/components/DaySection.jsx`
- `src/components/ScheduleItem.jsx`

Goal: extract repeated editor UI into shared components.

Requirements:

1. Extract only patterns used in 2+ places.
2. Candidate components:
   - editor action row
   - dirty cancel confirmation row
   - move/delete controls
   - validation error text
3. Keep component APIs small.
4. Do not over-abstract one-off editors.
5. Preserve all existing behavior and labels.
6. Do not change visual design beyond small consistency improvements.

Manual test flow to report:

- Save/cancel in two different editors.
- Trigger dirty cancel warning in two different editors.
- Move/delete items where applicable.
- Run `pnpm run build`.

Do not write automated tests.
