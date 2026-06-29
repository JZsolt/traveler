# 08-15 — Day Advanced JSON Editor

Read only:

- `src/components/DaySection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: edit secondary day fields with JSON textareas.

Fields:

- `images`
- `tickets`
- `alerts`
- `transportOptions`
- `costs`
- `endAlerts`

Requirements:

1. Add "Advanced day data" edit area.
2. Use one JSON textarea per field.
3. Validate JSON before save.
4. Show validation error near field.
5. Save updates only that day.
6. Preserve schedule.
7. No AI.

Manual test flow to report:

- Edit costs JSON.
- Enter invalid JSON and confirm save blocked.
- Confirm schedule still renders.
- Build passes.

Run `pnpm run build`.
