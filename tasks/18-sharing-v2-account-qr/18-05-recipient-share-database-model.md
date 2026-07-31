# 18-05 — Recipient Share Database Model — DONE

**Estimate:** 2-3 hours

## Goal

Add an account-to-account sharing model for pending, accepted, and revoked
recipient access.

## Scope

- `trip_share_recipients` table.
- Link to `trip_shares` and `trips`.
- `owner_id`.
- `recipient_user_id`.
- `recipient_email` only for a resolved `recipient_user_id` invite display,
  audit, and dedup; no standalone email-only claimable recipient rows.
- `created_at`, `accepted_at`, `declined_at`, `revoked_at`.
- Unique/index strategy.
- Explicit `on delete` strategy for `trip_id`, `share_id`, `owner_id`, and
  `recipient_user_id`.
- RLS strategy for owners and recipients.

## Acceptance Criteria

- Owner can manage recipients only for own trips.
- Recipient can see their own pending/accepted recipient rows.
- Recipient does not get raw `trips.trip_data` access.
- Duplicate active invites to the same user/email are constrained.
- Revoked/declined invites are representable.
- Email invites do not create future claim-on-signup access without a resolved
  recipient user.
- Trip deletion cascades recipient rows. Public-share (`trip_shares`) deletion is
  `set null` on `share_id`: account-recipient access is **independent** of the
  public link lifecycle (revoke/regenerate/delete of the link does not remove
  account access). Owner revoke of the invite, or trip deletion, removes access.
- User deletion behavior is explicit (cascade) and does not leave orphan rows.
- Recipient lifecycle mutations happen only via server endpoints (service role);
  the client has read-only (RLS-scoped) access to this table.

## Review Checklist

- [x] No recipient `trips` SELECT policy returns raw trip rows. (Migration adds
      **no** `trips` policy; recipient trip content comes only via the 18-07
      projection endpoint — documented in the migration header.)
- [x] Owner and recipient policies expose only their own recipient rows.
      (Owner policies `owner_id = auth.uid()`; recipient policies
      `recipient_user_id = auth.uid()`.)
- [x] Indexes support owner management and recipient dashboard queries.
      (`idx_tsr_trip_id_created_at`, `idx_tsr_owner_id`,
      `idx_tsr_recipient_user_id`.)
- [x] Invite-by-email and profile-QR paths both resolve to a recipient user
      before account-recipient access exists. (`recipient_user_id NOT NULL`;
      `recipient_email` only alongside a resolved user — no email-only claimable
      rows.)
- [x] Foreign keys document cascade vs set-null behavior intentionally. (Each FK
      has an inline comment.)

## Output

- Migration `supabase/migrations/007_trip_share_recipients.sql`:
  - `trip_share_recipients` with `trip_id`, `share_id`, `owner_id`,
    `recipient_user_id`, `recipient_email`, and `created_at` / `accepted_at` /
    `declined_at` / `revoked_at` lifecycle timestamps + ordering check constraints.
  - **FK on-delete (documented):** `trip_id` → `trips` **cascade**; `share_id` →
    `trip_shares` **set null** (account access is independent of the public link
    lifecycle); `owner_id` → `auth.users` **cascade**; `recipient_user_id` →
    `auth.users` **cascade**. No orphan rows on trip/user deletion.
  - **Duplicate constraint:** partial unique index on `(trip_id,
    recipient_user_id) where revoked_at is null and declined_at is null` — at most
    one active invite per trip+recipient; declined/revoked rows remain as history
    and a new invite can follow.
  - **Lifecycle-exclusivity check:** `not (accepted_at is not null and declined_at
    is not null)` — a row can't be both accepted and declined. (accepted+revoked
    is allowed: owner can revoke an accepted invite; "active" = accepted && not
    revoked && not declined, defined by the query.)
  - RLS enabled with **read-only** access for `authenticated`: owner SELECT
    (`owner_id = auth.uid()`) + recipient SELECT (`recipient_user_id =
    auth.uid()`). **No authenticated INSERT/UPDATE/DELETE policy** — all lifecycle
    mutations go through service-role server endpoints (18-06), so a recipient
    cannot re-activate a revoked invite or set inconsistent lifecycle fields.
    **No `trips` policy added.**
- Types: `TripShareRecipientRow` + `trip_share_recipients` Row/Insert/Update in
  `src/types/supabase.ts`.
- Full gate: lint clean, `tsc` 0, build OK, **171 tests**.
- NOTE: live RLS behavior (owner A cannot see/modify user B's invites; recipient
  sees only their own; no raw `trips` access) is a DB-enforced boundary — the
  live check is documented for 18-11 (needs Supabase).
