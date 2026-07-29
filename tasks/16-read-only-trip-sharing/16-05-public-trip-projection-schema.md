# 16-05 — Public Trip Projection Schema — DONE

**Estimate:** 1-2 hours

## Goal

Define the exact public shape returned for shared trips.

## Scope

- Public trip schema under `src/schemas/`.
- Public response type under `src/types/` if needed.
- Projection helper.
- Explicit exclusion list.

## Acceptance Criteria

- Public response excludes `owner_id`, user email, admin state, backup metadata,
  internal IDs not needed by UI, and future private notes.
- Projection output validates with Zod.
- Shared page uses the public projection type, not full `TripRow`.

## Review Checklist

- [x] No full trip database row is returned.
- [x] Projection is stable and testable.
- [x] Unknown/extra fields are intentionally handled.
- [x] Future private fields have a documented exclusion rule.

## Output

- Added `PublicDaySchema` + `PublicTripSchema` to `src/schemas/sharing.ts` as a
  **whitelist** (`TripSchema.pick` / `DaySchema.pick`), so any future Trip field
  is excluded by default until deliberately added.
- Added `projectPublicTrip(trip)` helper (parses through the whitelist schema,
  Zod strips non-whitelisted keys) — API-bundler-safe relative imports.
- Exported `PublicTrip` / `PublicDay` types from `src/types/api.ts` via `z.infer`.
- Documented exclusion list in code: `days[].tickets` (jegyek), `insurance`
  (uploaded PDFs), and internal fields (`status`, `aiModel`, `expandedDays`,
  `days[]._draft`). Per owner decision the projection keeps full accommodation,
  flight, and budget (link shared only with co-travelers).
- Hardened nested leaks: `AccommodationSchema` and `GuideSchema` are
  `.passthrough()`, so a top-level whitelist alone would let extra/future nested
  keys (e.g. `accommodation.privateNote`) escape. Added `.strip()`-based
  `PublicAccommodationSchema` / `PublicGuideSchema`, and built
  `PublicScheduleItemSchema` / `PublicDaySchema` / `PublicTripSchema` from them.
- Added 5 projection unit tests (strip, keep, self-validate, future top-level
  drop, nested passthrough strip); 9 sharing tests pass, `pnpm build` green.
