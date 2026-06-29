# 08-11 — Flight/Transport Basics Editor

Read only:

- `src/components/trip/TripHero.jsx`
- `src/hooks/useTripUpdater.js`

Goal: inline edit trip-level transport summary.

Editable fields:

- `flight.airport`
- `flight.arrival`
- `flight.departure`

Requirements:

1. Add separate transport edit block.
2. Initialize missing `flight`.
3. Preserve unknown flight fields.
4. Save updates only `flight`.
5. No AI.

Manual test flow to report:

- Edit airport/arrival/departure.
- Confirm hero transport line updates.
- Build passes.

Run `pnpm run build`.
