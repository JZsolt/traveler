# 18-07 — Shared-With-Me Projection Endpoint — DONE

**Estimate:** 2-3 hours

## Goal

Return accepted recipient trips through the same safe public projection used by
public links.

## Scope

- Authenticated `GET /api/shared-with-me`.
- Pending invites endpoint/shape if needed.
- Service-role load of accepted recipient trips.
- `TripSchema` boundary validation.
- `projectPublicTrip` projection.
- Response schema and public shared trip type reuse.

## Acceptance Criteria

- Accepted recipient receives only `PublicTrip`, never raw `TripRow`.
- Pending invite list does not expose full trip data unless deliberately allowed.
- Revoked/declined rows are excluded.
- Owner/private fields remain excluded.

## Review Checklist

- [x] No raw `trips.trip_data` reaches the browser for recipient views.
      (Service-role load → `TripSchema` boundary → `projectPublicTrip`; only
      `PublicTrip` / teaser is returned. No recipient `trips` RLS policy.)
- [x] Endpoint requires auth. (`requireAuthenticatedUser`; GET-only.)
- [x] Projection strips future top-level and nested private fields.
      (`projectPublicTrip` whitelist; test asserts `insurance` + `days[].tickets`
      stripped.)
- [x] Response is Zod-validated. (`SharedWithMeResponseSchema.safeParse`.)

## Output

- `GET /api/shared-with-me` (auth required). Returns the recipient's **accepted**
  shared trips as `PublicTrip[]`, plus their **pending** invites as a minimal
  teaser list.
- `api/_shared-with-me.ts` `buildSharedWithMe(ctx, userId)`:
  - Loads the recipient's non-declined, non-revoked `trip_share_recipients` rows;
    splits by `accepted_at` (accepted vs pending).
  - Loads `trips.trip_data` for those ids with the service role, validates each
    with `TripSchema`, and projects accepted trips through `projectPublicTrip`.
  - Pending → **teaser only** (`inviteId`, `title`, `emoji`, `subtitle`,
    `destination`) — no itinerary/schedule/accommodation before acceptance.
  - Revoked/declined rows are excluded at the query (`.is('declined_at', null)
    .is('revoked_at', null)`), so revoke/decline immediately removes access.
- Schemas `PendingInviteSchema` + `SharedWithMeResponseSchema` (reusing
  `PublicTripSchema`); types `PendingInvite` / `SharedWithMeResponse`;
  `API.SHARED_WITH_ME`.
- Tests: `api/__tests__/shared-with-me.test.ts` (3) — non-GET 405, empty state,
  accepted-projected (private fields stripped) + pending-teaser (no full trip
  data).
- **No silent drop (review fix):** if an accepted/pending trip's `trip_data` is
  invalid/missing it is **not** silently skipped — it is counted in the response's
  `unavailableCount` and logged structurally (`console.warn` with `tripId` /
  `inviteId`, no raw data). The dashboard can show "N shared items are currently
  unavailable" instead of the share appearing to vanish while DB access remains.
- Full gate: lint clean, `tsc` 0, build OK, **186 tests**.
- NOTE: the live recipient round-trip (accept → appears in shared-with-me →
  revoke → gone) is a DB-backed flow verified for 18-11 (needs Supabase).
