# 18 — Sharing V2: QR, Persistent Links, And Account Sharing

Status: planned. Start only after Phase 16 read-only public sharing is merged.

## Goal

Make sharing simple for both non-app users and app users:

- Public link works for anyone.
- QR code is available for the public link.
- Owners can reopen the share modal and see/copy the active link again.
- Existing app users can receive a trip into a safe "Megosztva velem" flow.
- Profile QR and email sharing are abuse-resistant and opt-in.

## Critical Principles

- Public lookup continues to use `token_hash`; raw token is never used for DB
  lookup.
- To re-display active public links, store only encrypted token ciphertext, not
  plaintext tokens.
- Recipients must never get direct raw `trips.trip_data` access through RLS.
  Recipient reads must pass through `projectPublicTrip`.
- Account-to-account sharing uses an accept gate. Invites are pending until the
  recipient accepts them.
- Recipient access is live, not a snapshot: accepted recipients see the current
  projected trip, and revoke/delete takes effect immediately.
- Email sending must include provider, rate limit, and abuse controls before it
  can ship.
- Email invites to non-existing app users are public-link-only by default; they
  must not silently become future account access by email match.
- Profile QR/user public IDs must be opt-in, rotatable, and disableable.
- Repeated pending invites must have harassment/spam mitigation.

## Subtasks

1. `18-01-sharing-v2-product-security-spec.md`
2. `18-02-encrypted-public-share-token-storage.md`
3. `18-03-owner-share-management-endpoint.md`
4. `18-04-public-link-qr-ui.md`
5. `18-05-recipient-share-database-model.md`
6. `18-06-recipient-invite-and-accept-endpoints.md`
7. `18-07-shared-with-me-projection-endpoint.md`
8. `18-08-dashboard-shared-with-me-and-invites.md`
9. `18-09-profile-qr-opt-in-and-rotation.md`
10. `18-10-email-invite-provider-and-abuse-controls.md`
11. `18-11-sharing-v2-security-tests-and-e2e.md`

## Workflow

Implement exactly one task from `tasks/18-sharing-v2-account-qr/`, run the
quality gate, mark only that task done, and stop.

## Non-goals

- No edit/collaboration roles.
- No public trip search.
- No recipient raw trip row access.
- No plaintext share token storage.
- No email sending without rate limits and abuse controls.
