# 18-03 — Owner Share Management Endpoint — DONE

**Estimate:** 2-3 hours

## Goal

Move owner share management to server endpoints so the UI can list, decrypt,
create, regenerate, and revoke public links through a single owner-verified API.

## Scope

- `GET /api/trip-share-management` or equivalent owner endpoint.
- Active public link metadata and decrypted public URL for owner only.
- Create/regenerate public link.
- Revoke public link.
- Owner check server-side.
- Zod request/response schemas.
- Client hook refactor to use the endpoint.

## Acceptance Criteria

- Owner can reopen modal and see the active public link.
- Non-owner cannot list, decrypt, create, regenerate, or revoke links.
- Regenerate revokes the old link and returns a new link.
- Revoke confirms a row was affected or returns a clear stale-state response.
- Client no longer needs direct `trip_shares` mutation for public link actions.

## Review Checklist

- [x] Decryption only happens in owner-authenticated endpoint code.
      (`decryptForOwner` in `trip-share-management.ts`, behind
      `requireAuthenticatedUser` + owner-scoped `resolveOwnedTripId`.)
- [x] Response does not include `token_hash` or DB internals.
      (`ManagedShareSchema` = id/token/createdAt/expiresAt only; test asserts
      `token_hash`/`token_ciphertext`/`ownerId` are stripped.)
- [x] 0-row update/delete is handled explicitly. (`revokeActiveShares` returns a
      boolean; the `revoke` response carries `revoked: true|false`.)
- [x] API response is Zod-validated on server and client. (Server `sendShare`
      validates with `TripShareManagementResponseSchema`; the hook validates the
      same schema client-side.)

## Output

- Single owner endpoint `POST /api/trip-share-management` with
  `{ slug, action: 'get'|'create'|'regenerate'|'revoke', expiresAt? }`.
  Auth via `requireAuthenticatedUser`; ownership via owner-scoped
  `resolveOwnedTripId(slug)` → 404 for non-owners.
  - **get:** returns the active share and, if re-displayable, the **decrypted**
    token (so the modal shows the link on reopen). Legacy/undecryptable →
    `token: null`.
  - **create:** revokes expired, rejects if an active share exists (409), else
    creates (encrypt + hash + insert).
  - **regenerate:** revokes all active, then creates a fresh link.
  - **revoke:** revokes active shares, returns `revoked` (0-row aware).
- `api/_share-management.ts` — `resolveOwnedTripId`, `loadActiveShare`,
  `revokeExpiredShares`, `revokeActiveShares`, `buildShareToken` (encryption
  preflight → `BuildShareTokenOutcome`) + `insertShareRow` (→
  `CreateShareOutcome`). Raw token never logged.
- **Removed `api/create-trip-share.ts`** (superseded); its create logic moved
  into `_share-management` (`buildShareToken` + `insertShareRow`). Removed
  `CreateTripShare*` schemas/types
  and `API.CREATE_TRIP_SHARE`; added `TripShareManagement*` schemas/types and
  `API.TRIP_SHARE_MANAGEMENT`.
- Client `useTripSharing` refactored to call only the endpoint — **no more
  client-side `trip_shares` mutation** and no client-side trip-id resolution.
  On open, `get` populates the link if re-displayable. (The read-only badge hook
  `useSharedSlugs` stays a client read, not a mutation.)
- Schemas validated on both sides; the raw token is returned only to the
  authenticated owner (it is the secret they are entitled to), never
  `token_hash`/ciphertext.
- Tests: replaced `CreateTripShare*` schema tests with `TripShareManagement*`
  tests (request actions/expiry; response active/legacy-null/revoke/stripping).
- Full gate: lint clean, `tsc` 0, build OK, **163 tests**.

### Review fixes
- **Expired-share consistency (Medium):** `loadActiveShare` now filters out
  expired rows (`revoked_at is null` **and** not expired), so `get` never returns
  a link the public lookup would reject. Client `shareUrl` is additionally gated
  on `isShareActive(activeShare) && token`.
- **Regenerate atomicity (Medium):** split `createShare` into `buildShareToken`
  (encryption **preflight**) + `insertShareRow`. Regenerate now encrypts before
  revoking the old link, so an encryption/env failure leaves the working old link
  intact (test asserts no `trip_shares` mutation on preflight failure). Residual
  insert-after-revoke window noted for a future DB-transaction/RPC.
- **Endpoint tests (Medium):** added `api/__tests__/trip-share-management.test.ts`
  (8) with a chainable Supabase mock + mocked auth: non-owner 404, get
  null/decrypted/legacy-null, no `token_hash` leak, revoke `revoked:false`/`true`,
  duplicate-create 409, regenerate preflight failure leaves old link intact.
- **Type hygiene (Low):** removed the untyped `let encrypted`; token material now
  uses `PreparedShareToken` / `BuildShareTokenOutcome` types in `apiServer.ts`.
- Gate after fixes: lint clean, `tsc` 0, build OK, **171 tests**.
