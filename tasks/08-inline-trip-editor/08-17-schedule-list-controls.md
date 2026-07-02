# 08-17 — Schedule Add/Delete/Reorder ✅ DONE

Read only:

- `src/components/DaySection.jsx`
- `src/components/ScheduleItem.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: manage schedule items inside one day.

Requirements:

1. Add "Add schedule item" inside each day.
2. Add delete item with confirmation.
3. Add move up/down within the day.
4. New item defaults:

```json
{ "time": "", "title": "Új program", "desc": "", "links": [], "guide": {} }
```

5. Preserve day and trip unknown fields.
6. No AI.

Manual test flow to report:

- Add item.
- Move item.
- Delete item.
- Build passes.

Run `pnpm run build`.
