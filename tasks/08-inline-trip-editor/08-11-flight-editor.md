# 08-11 — Flight/Transport Basics Editor ✅ DONE

Read only:

- `src/components/trip/TripHero.jsx`
- `src/hooks/useTripUpdater.js`

Goal: inline edit trip-level transport summary.

Implementation note:

- The transport fields live inside the main `TripHero` unified editor as a "Közlekedés" section.
- A separate Save action is NOT required — the unified hero Save writes hero + accommodation + flight together.
- The important data rule is that unknown `flight` subfields are preserved via spread.

Editable fields:

- `flight.airport`
- `flight.arrival`
- `flight.departure`

Requirements:

1. Add a transport edit section in `TripHero`.
2. Initialize missing `flight`.
3. Preserve unknown flight fields.
4. If saved through the main hero editor, preserve unknown trip fields and unknown flight fields.
5. No AI.

Manual test flow to report:

- Edit airport/arrival/departure.
- Confirm hero transport line updates.
- Build passes.

Run `pnpm run build`.
