# 08-01 — Shared Trip Updater

Read only:

- `src/context/TripsContext.jsx`
- `src/lib/supabase.js`
- `src/lib/normalizeTrip.js`

Goal: create one reusable hook for saving modified `trip_data`.

Requirements:

1. Create `src/hooks/useTripUpdater.js`.
2. Export `useTripUpdater({ trip, slug, refetch })`.
3. Return `saveTrip`, `saving`, `error`.
4. `saveTrip` accepts a full trip object or `(currentTrip) => updatedTrip`.
5. Save to Supabase `trips.trip_data`.
6. Preserve unknown fields by starting from current `trip`.
7. Call `refetch()` after success.
8. No UI changes.
9. No AI.

Manual test flow to report:

- Build passes.
- Existing TripPage visually unchanged.
- Note that no UI behavior is expected yet.

Run `pnpm run build`.
