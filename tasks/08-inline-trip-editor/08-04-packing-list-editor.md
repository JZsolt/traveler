# 08-04 — Packing List Editor

Read only:

- `src/components/trip/PackingList.jsx`
- `src/components/editor/EditableSection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: prove the edit architecture on the smallest list section.

Requirements:

1. Add inline edit to `PackingList`.
2. Support add/edit/delete/move up/down item strings.
3. Save updates only `packingList`.
4. Cancel discards local changes.
5. Empty list remains editable.
6. Preserve existing view mode.
7. No AI.

Manual test flow to report:

- Add packing item.
- Edit packing item.
- Delete packing item.
- Reorder item.
- Cancel after local edit and verify no persistence.
- iPhone 12 mini: no overflow.
- Build passes.

Run `pnpm run build`.
