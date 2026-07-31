# 18-06 — Recipient Invite And Accept Endpoints — DONE (profile-QR path deferred to 18-09)

**Estimate:** 3-4 hours

## Goal

Allow owners to invite app users by email or profile QR, and allow recipients to
accept or decline invites.

## Scope

- Owner invite endpoint.
- Resolve existing user by safe server-side lookup.
- Profile QR invite endpoint/path.
- Non-existing app user email behavior stays public-link-only and does not
  create claimable account access by email match.
- Recipient accept endpoint.
- Recipient decline endpoint.
- Owner revoke endpoint.
- Duplicate and excessive pending invite controls.
- Zod schemas and safe errors.
- No automatic accepted dashboard item before recipient consent.

## Acceptance Criteria

- Existing app user invite creates a pending recipient row.
- Profile QR invite creates a pending recipient row only if QR sharing is enabled.
- Recipient must accept before the trip appears in "Megosztva velem".
- Recipient can decline.
- Owner can revoke pending or accepted access.
- Email addresses that do not belong to an app user do not create pending
  account-recipient access.
- Excessive pending invites are limited or rejected deterministically.

## Review Checklist

- [x] Invite endpoints require owner auth and trip ownership.
      (`requireAuthenticatedUser` + `resolveOwnedTripId(slug)`.)
- [x] Accept/decline endpoints require recipient auth. (Update scoped to
      `recipient_user_id = ctx.user.id`.)
- [x] Errors do not leak unrelated user/profile data. (Email→id resolution via a
      service-role-only SQL function returning only an id/null; responses are a
      status enum, never another user's profile.)
- [x] Duplicate pending invite behavior is deterministic. (Partial unique index
      → 23505 → `already_invited`.)
- [x] Invite spam across many trips has a server-side mitigation. (Per-recipient
      pending-invite cap of 20 → `invite_limit`.)

## Output

- Migration `008_resolve_user_by_email.sql` — `security definer`
  `resolve_user_id_by_email(text)`; **execute granted only to `service_role`**
  (no client-side user enumeration). Added to `Database.Functions` types.
- Single owner/recipient endpoint `POST /api/trip-recipients` (`action`
  discriminated): `invite` (owner, by email), `accept`/`decline` (recipient),
  `revoke` (owner). Auth via `requireAuthenticatedUser`; owner via
  `resolveOwnedTripId`, recipient/owner scoping in the DB `.eq(...)` filters.
- `api/_recipient-management.ts` — `resolveUserIdByEmail`, `createPendingInvite`
  (23505 → `already_invited`), `respondToInvite` (accept/decline only a **pending**
  invite the caller owns → accept-gate + no re-activation), `revokeInvite`,
  `isPendingInviteLimitReached` (cap 20).
- Statuses: `invited | already_invited | not_app_user | self | invite_limit |
  accepted | declined | revoked | noop`. Non-app-user emails → `not_app_user`
  (public-link path, no claimable row). Recipient trip appears in "Megosztva
  velem" only after `accept` (18-07/18-08 consume the accepted rows).
- Schemas `src/schemas/recipients.ts`, types `src/types/recipients.ts`.
- Tests: `api/__tests__/trip-recipients.test.ts` (11) — non-owner 404,
  not_app_user, self, invited, already_invited, invite_limit, accept/decline/
  noop, revoke/noop, malformed request 400.
- **Profile-QR invite path deferred to 18-09** (owns `profiles.public_share_id`);
  the invite flow will add a QR-based resolver there. Email path is complete.
- Full gate: lint clean, `tsc` 0, build OK, **182 tests**.

## Product & security note — account-existence signal (deliberate)

The `invite` response distinguishes existing app users (`invited` /
`already_invited` / `self` / `invite_limit`) from non-users (`not_app_user`).
This is an **account-existence signal**: an authenticated owner can learn whether
an email belongs to a registered user. It is **deliberate and inherent** to the
invite-by-email UX — the owner must know whether the invite created an
account-recipient or should fall back to the public link/email path (the product
goal: "app users get a saved invite, non-users get the public link").

It never leaks profile data (no name/avatar/other trips), only existence. It is
**not anonymous** (requires an authenticated owner). Current mitigations:

- Email→id resolution is a `service_role`-only SQL function (no client access).
- Per-recipient pending-invite cap (`invite_limit`) bounds volume to one target.

Deferred hardening (**18-10**): per-owner rate limiting / throttling to prevent
bulk email probing, and the **server-side non-user email fallback**. Once 18-10
sends the public link server-side, the response can be made generic (e.g.
`invite_sent`) so the owner no longer observes existence — decide there.
