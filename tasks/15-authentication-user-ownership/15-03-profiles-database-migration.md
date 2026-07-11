# 15-03 — Profiles Database Migration

**Estimate:** 1-3 hours

## Goal

Add an application profile table linked to `auth.users`.

## Scope

- `profiles` table
- `id uuid primary key references auth.users(id)`
- `display_name`, `avatar_url`, timestamps
- Profile bootstrap path
- Profile RLS policies

## Acceptance Criteria

- Every new authenticated user can get a profile.
- A user can read/update only their own profile.
- Other users' private profile data cannot be queried.
- Migration is Vercel/Supabase compatible.

## Review Checklist

- [ ] No user-editable `is_admin` field is introduced.
- [ ] RLS is enabled on `profiles`.
- [ ] Profile bootstrap is idempotent.
- [ ] Zod/runtime boundary tasks are not skipped.
