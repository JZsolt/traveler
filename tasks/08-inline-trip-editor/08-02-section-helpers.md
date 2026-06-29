# 08-02 — Pure Section Helpers

Read only:

- `src/lib/normalizeTrip.js`
- `src/hooks/useTripUpdater.js`

Goal: add pure helpers for future section updates.

Requirements:

1. Create `src/lib/tripSections.js`.
2. Add `replaceTripSection(trip, key, value)`.
3. Add `replaceTripDay(trip, dayNum, updatedDay)`.
4. Add `replaceScheduleItem(trip, dayNum, itemIndex, updatedItem)`.
5. Return new trip objects.
6. Preserve unrelated and unknown fields.
7. No UI changes.
8. No AI.

Manual test flow to report:

- Build passes.
- Existing app behavior unchanged.

Run `pnpm run build`.
