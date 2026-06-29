# 08-14 — Day Add/Delete/Reorder Controls

Read only:

- `src/pages/TripPage.jsx`
- `src/components/DaySection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: manage the `days` array.

Requirements:

1. Add "Add day" control near days list.
2. Add move up/down controls for each day.
3. Add delete day with confirmation.
4. After add/delete/reorder, normalize `dayNum` to `1..N`.
5. Preserve nested day data.
6. Leave `overview` unchanged in this task and mention this limitation in summary.
7. Do not edit schedule items.
8. No AI.

Manual test flow to report:

- Add day.
- Move day up/down.
- Delete day.
- Confirm `dayNum` sequential.
- Build passes.

Run `pnpm run build`.
