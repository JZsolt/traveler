# 16-04 — Public Shared Trip Lookup — DONE

**Estimate:** 2-3 hours

## Goal

Allow anonymous lookup of an active shared trip by token.

## Scope

- `/api/share/:token` or equivalent endpoint/RPC.
- Hash incoming token.
- Lookup active share.
- Join/load trip safely.
- Return only public projection.
- Invalid, expired, and revoked states.

## Acceptance Criteria

- Anonymous user cannot query `trips` directly.
- Random token returns controlled not-found response.
- Revoked/expired token returns controlled invalid response.
- Active token returns safe public trip projection.

## Review Checklist

- [x] No `supabase.from('trips').select('*')` public policy is added.
- [x] Token input is treated as `unknown` and schema-validated.
- [x] Raw trip row does not reach response formatting unvalidated.
- [x] Errors do not reveal whether a private trip exists.

## Output

- Added `POST /api/shared-trip` — anonymous lookup, token in request body (kept
  out of URL/CDN access logs), no auth required.
- Extracted token hashing into shared `api/_share-token.ts`
  (`createRawShareToken`, `hashShareToken`) and refactored `create-trip-share.ts`
  to reuse it (removed the duplicated crypto helpers).
- Added `SharedTripRequestSchema` (token `unknown` -> validated string) and
  `PublicSharedTripResponseSchema` to `src/schemas/sharing.ts`; types exported
  from `src/types/api.ts`.
- Lookup uses a service-role client (anon cannot query `trips`/`trip_shares`
  directly; no public policy added). Filters `token_hash` + `revoked_at is null`
  + not-expired.
- Uniform controlled `404 SHARE_NOT_FOUND` for random / expired / revoked /
  malformed-token / deleted-trip cases — never reveals whether a private trip
  exists.
- Raw `trip_data` (`unknown`) is validated with `TripSchema` before projection;
  output goes through `projectPublicTrip` + `PublicSharedTripResponseSchema`
  (second safety net that strips private fields even if projection is skipped).
- Added 4 schema tests; full suite 140 tests pass, `tsc --noEmit` and
  `pnpm build` green.
