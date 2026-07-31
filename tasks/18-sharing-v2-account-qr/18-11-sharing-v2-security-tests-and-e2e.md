# 18-11 — Sharing V2 Security Tests And E2E ✅ DONE

**Estimate:** 2-4 hours

## Goal

Verify the expanded sharing model: encrypted links, QR, account recipients,
pending invites, profile QR privacy, and email abuse controls.

## Scope

- Unit tests for encryption/decryption helper.
- Unit tests for profile public ID format/rotation behavior.
- Schema tests for recipient invite and shared-with-me responses.
- Endpoint tests where practical.
- Documented Supabase live RLS checks.
- Manual E2E checklist.

## Output

- Added public shared-trip endpoint tests:
  - malformed token returns the same controlled 404;
  - lookup uses `token_hash`, not the raw token;
  - response strips private fields through the public projection.
- Consolidated existing security coverage across Phase 18:
  - share token hash + AES-256-GCM ciphertext round-trip;
  - owner share management auth gate and legacy ciphertext fallback;
  - recipient invite accept/decline/revoke scoping;
  - shared-with-me projection strips private data and keeps pending teaser-only;
  - profile QR enable/disable/rotate and disabled/rotated invite behavior;
  - email invite malformed/bulk rejection, provider env failure, ownership,
    duplicate/rate-limit, provider failure, non-app public-link path, and existing
    app pending-invite path.
- Added [Sharing V2 Security Checklist](../../docs/architecture/SHARING_V2_SECURITY_CHECKLIST.md)
  with live Supabase RLS checks and manual E2E steps for:
  - create link;
  - QR open;
  - invite accept;
  - revoke;
  - email invite.

## Acceptance Criteria

- Token ciphertext round-trip is covered without logging raw tokens.
- Public lookup still uses token hash.
- Recipient shared-with-me responses exclude private fields.
- Pending invites do not appear as accepted shared trips.
- Profile QR disabled/rotated states are covered.
- Email rate-limit/abuse controls are tested or documented.
- Full quality gate passes.

## Review Checklist

- [x] Tests do not log raw tokens.
- [x] DB dump alone does not reveal active share URLs.
- [x] Recipient cannot mutate owner trip.
- [x] Share token holder does not gain owner or recipient rights.
- [x] Live E2E checklist covers create link, QR open, invite accept, revoke, and email.
