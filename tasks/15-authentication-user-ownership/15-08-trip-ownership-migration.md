# 15-08 — Trip Ownership Migration

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

- No trip remains without an owner after migration.
- New trips automatically use the authenticated user's id.
- Frontend cannot successfully spoof another `owner_id`.
- Existing seed/import paths are either updated or explicitly deferred.

## Review Checklist

- [ ] Migration is reversible or safely staged.
- [ ] Existing data is not orphaned.
- [ ] `owner text` compatibility is handled intentionally.
- [ ] Service-role scripts do not bypass validation silently.
