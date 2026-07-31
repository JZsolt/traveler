# 18-02 — Encrypted Public Share Token Storage — DONE

**Estimate:** 2-3 hours

## Goal

Allow owners to reopen the share modal and see/copy the active public link while
preserving hash-based lookup and avoiding plaintext token storage.

## Scope

- Migration for encrypted token storage.
- `token_ciphertext text not null` or equivalent encrypted payload.
- `token_key_version int not null default 1`.
- Server crypto helper.
- `SHARE_TOKEN_ENCRYPTION_KEY` env validation.
- Migration/backfill strategy for existing hash-only shares.
- Tests for encryption/decryption and no plaintext token storage.

## Acceptance Criteria

- Public lookup still uses `token_hash`.
- DB does not store plaintext raw token.
- Owner-only server code can decrypt the active token for management UI.
- Missing/invalid encryption key fails safely.
- Existing shares without ciphertext have deterministic behavior documented.

## Review Checklist

- [x] Encryption uses authenticated encryption, for example AES-GCM.
      (AES-256-GCM in `api/_share-crypto.ts`.)
- [x] Ciphertext includes IV/auth tag in a parseable format.
      (`ivB64.tagB64.dataB64`.)
- [x] Raw token is not logged. (Create endpoint logs only `err.message`; tests
      never print a token.)
- [x] Key versioning is represented for future rotation. (`token_key_version`
      column + `CURRENT_SHARE_KEY_VERSION` + `KEY_ENV_BY_VERSION` map.)

## Output

- Migration `supabase/migrations/006_share_token_ciphertext.sql` — adds
  `token_ciphertext text` (nullable) and `token_key_version int not null default
  1` to `trip_shares`, with column comments documenting format and legacy
  behavior.
- `api/_share-crypto.ts` — `encryptShareToken` / `decryptShareToken`
  (AES-256-GCM, random 12-byte IV, auth tag), `CURRENT_SHARE_KEY_VERSION`, and a
  version→env-var key map for future rotation. Key loaded only from server env
  (`SHARE_TOKEN_ENCRYPTION_KEY`), validated to 32 bytes; missing/invalid key
  throws (fail-safe). Server-only module (`api/`), never imported by the client.
- `create-trip-share.ts` — encrypts the raw token and stores
  `token_ciphertext` + `token_key_version` on insert. If encryption fails
  (missing/invalid key), returns `500 SHARE_ENCRYPTION_FAILED` and creates no
  share (never a plaintext or non-re-displayable one). Public lookup path
  (`shared-trip.ts`) is unchanged — still hash-only.
- Types: `TripShareRow` + `trip_shares` Insert/Update in `src/types/supabase.ts`.
- Tests: `api/__tests__/share-crypto.test.ts` (10) — round-trip, no plaintext,
  parseable format, random IV, key version, tamper rejection, wrong/missing/
  invalid key, malformed ciphertext.
- **Legacy behavior:** Phase-16 shares have `token_ciphertext IS NULL` →
  re-displayable iff ciphertext present; the owner UI (18-04) offers regenerate.
- **Ops:** `SHARE_TOKEN_ENCRYPTION_KEY` (base64 of 32 random bytes, e.g.
  `openssl rand -base64 32`) must be set in `.env.local` and on Vercel, or share
  creation fails safely with `SHARE_ENCRYPTION_FAILED`. Documented in
  `.env.example` and the README env table (review fix).
- Type hygiene (review fix): the `{ ciphertext, keyVersion }` shape is now the
  shared `ShareTokenEncryptionResult` type in `src/types/apiServer.ts` (no inline
  object type in API files).
- Full gate: lint clean, `tsc` 0, build OK, **161 tests**.
