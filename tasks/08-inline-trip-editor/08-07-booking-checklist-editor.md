# 08-07 — Booking Checklist Editor

Read only:

- `src/components/trip/BookingChecklist.jsx`
- `src/components/editor/EditableSection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: inline manual edit for booking checklist.

Item shape:

```json
{ "item": "", "url": "", "done": false }
```

Requirements:

1. Add edit mode to `BookingChecklist`.
2. Support add/edit/delete/move up/down.
3. Support toggling `done`.
4. Validate `item` is non-empty.
5. Save updates only `bookingChecklist`.
6. No AI.

Manual test flow to report:

- Add item.
- Toggle done.
- Confirm rendered done/strikethrough behavior.
- Try empty item and verify UI error.
- Build passes.

Run `pnpm run build`.
