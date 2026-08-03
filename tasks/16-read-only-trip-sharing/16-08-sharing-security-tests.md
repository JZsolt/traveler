# 16-08 — Sharing Security Tests — DONE

**Estimate:** 2-3 hours

## Goal

Verify the sharing security boundary.

## Scope

- Non-owner cannot create link.
- Revoked token fails.
- Random token fails safely.
- Public response excludes private fields.
- Anonymous user cannot mutate trip.
- Share token holder does not gain owner rights.

## Acceptance Criteria

- Automated or documented tests cover all cases above.
- Full quality gate passes.
- Any untestable Supabase dashboard configuration is documented.

## Review Checklist

- [x] Tests do not log tokens. (`share-token.test.ts` asserts on hashes/format,
  never prints a raw token.)
- [x] Token hash behavior is covered. (`api/__tests__/share-token.test.ts`)
- [x] Public projection is checked for excluded fields.
  (`src/schemas/__tests__/sharing.test.ts` — projection + response tests)
- [x] RLS remains private for `trips`. (migration `004_trip_rls_owner_scoped.sql`
  — see matrix below)

## Output

### Automated tests added
- `api/__tests__/share-token.test.ts` (5 tests) — SHA-256 hash is deterministic
  64-hex, hash ≠ raw token, distinct tokens → distinct hashes; `createRawShareToken`
  is url-safe base64url ≥43 chars and unique across 200 calls. No token is logged.
- `api/__tests__/server-auth.test.ts` (6 tests) — `requireAuthenticatedUser`
  rejects missing env (500), anonymous (401 `MISSING_AUTH`), non-Bearer scheme,
  invalid/expired token (401 `INVALID_TOKEN`); accepts a valid (and
  case-insensitive) Bearer and returns the user context.
- Existing `src/schemas/__tests__/sharing.test.ts` (12 tests) — public projection
  and response schema strip every private field (tickets, insurance, internal
  flags, nested accommodation/guide extras).
- Full gate: `pnpm run lint` clean, `tsc --noEmit` 0, `pnpm build`, **151 tests**.

### Security boundary matrix

| # | Boundary | Enforcement | Coverage |
|---|----------|-------------|----------|
| 1 | Non-owner cannot create link | `requireAuthenticatedUser` (401 for anon/invalid) → `create-trip-share.ts` ownership check `.eq('owner_id', ctx.user.id)` → 404 `TRIP_NOT_FOUND`; also trips RLS | **Automated** auth gate (`server-auth.test.ts`); ownership `.eq` + RLS **documented** |
| 2 | Revoked token fails | `shared-trip.ts` filters `.is('revoked_at', null)` → miss → uniform 404 `SHARE_NOT_FOUND` | **Documented** (endpoint code); needs live DB |
| 3 | Random token fails safely | token hashed (`hashShareToken`), no matching row → uniform 404; malformed body → same 404 (no info leak) | **Automated** hashing (`share-token.test.ts`); 404 path **documented** |
| 4 | Public response excludes private fields | `projectPublicTrip` whitelist + `.strip()` nested; `PublicSharedTripResponseSchema` | **Automated** (`sharing.test.ts`) |
| 5 | Anonymous cannot mutate trip | trips RLS owner-scoped (migration 004): `insert/update/delete using/with check (auth.uid() = owner_id)`; anon `auth.uid()` is null → 0 rows | **Documented** (RLS policy) |
| 6 | Token holder gains no owner rights | share token is only accepted by the read-only `shared-trip` endpoint (returns `PublicTrip`); it is not a session/JWT and no owner endpoint accepts it — those require `requireAuthenticatedUser` | **Automated** auth gate + **documented** |

### Untestable-in-unit config (requires Supabase dashboard / live env)
- `trips` and `trip_shares` **RLS is enforced by Postgres**, not app code —
  verified by reading migrations `004_trip_rls_owner_scoped.sql` and
  `005_trip_shares.sql` (owner-scoped select/insert/update/delete; no public
  read policy; no anon grant in-repo). A live check would run authenticated as
  user A and confirm user B's trips/shares are invisible and unmodifiable.
- End-to-end token round-trip (create → fetch → revoke → 404) needs Supabase +
  local API runtime; the server logic and Zod boundaries are unit/code verified but
  the live path was not driven here.
