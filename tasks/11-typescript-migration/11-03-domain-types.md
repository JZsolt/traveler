# 11-03 — Domain Types ✅ DONE

Read only:

- `docs/architecture/TYPESCRIPT.md`
- `src/data/trips/_template.json`
- `src/lib/normalizeTrip.js`
- `src/lib/tripSections.js`
- `src/lib/validateTripJson.js`

Goal: add shared domain type definitions without migrating call sites yet.

Requirements:

1. Create `src/types/trip.ts`.
2. Define exported types for the models documented in `TYPESCRIPT.md`.
3. Define `Trip`, `Day`, and `ScheduleItem` exactly once in this file.
4. Do not define duplicate equivalents such as `TripData`, `TripDay`, `Activity`, or local page/component copies.
5. Include flexible fields where current data is intentionally extensible:
   - unknown guide fields
   - unknown accommodation fields
   - optional day/editor fields
6. Create `src/types/api.ts` for shared API request/response shapes used by AI/admin/import flows.
7. Do not import these types broadly yet; this task should be low-risk.
8. Do not use `any`; use `unknown` for extensible raw data.
9. Update `docs/architecture/TYPESCRIPT.md` with the type file locations.

Manual test flow to report:

- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
