# 15-08 — Trip Ownership Migration ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Assign every trip to a Supabase auth user.

## Scope

- Add `owner_id uuid` referencing `auth.users(id)`
- Backfill existing trips to configured initial owner
- Add indexes
- Update create/upsert paths
- Decide and document how old `owner text` is deprecated
- Move toward `owner_id not null`

## Acceptance Criteria

- No trip remains without an owner after migration + manual backfill.
- New trips automatically use the authenticated user's id.
- Existing seed/import paths are either updated or explicitly deferred.
- Admin backup import assigns `ADMIN_USER_ID` as `owner_id` on every inserted trip.
- Note: `owner_id` spoofing prevention deferred to 15-09 (RLS insert policy).

## Review Checklist

- [ ] Migration is reversible or safely staged.
- [ ] Existing data is not orphaned.
- [ ] `owner text` compatibility is handled intentionally.
- [ ] Service-role scripts do not bypass validation silently.
