# 15-09 — Trip RLS Policies ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Make trip privacy a database-level guarantee.

## Scope

- Remove public trip table read policy.
- Add own-trip SELECT policy.
- Add own-trip INSERT policy.
- Add own-trip UPDATE policy.
- Add own-trip DELETE policy.
- Prevent `owner_id` reassignment.
- Add SQL/RLS verification notes or tests.

## Acceptance Criteria

- User A cannot list User B trips.
- User A cannot fetch User B trip by known id or slug.
- User A cannot update/delete User B trip.
- User A cannot insert/update a trip owned by User B.
- Frontend cannot spoof another user's `owner_id` on insert (INSERT policy enforces `auth.uid() = owner_id`).
- Anonymous users cannot read `trips` directly.

## RLS Verification SQL

Run these in the Supabase SQL Editor after applying migration 004.

```sql
-- 1. Anon: should return 0 rows
-- (run as anon role or set role to anon in SQL Editor)
set role anon;
select count(*) from public.trips;
-- Expected: 0
reset role;

-- 2. User A: should see only own trips
-- (set JWT claims to User A's UUID)
set request.jwt.claims = '{"sub": "<user-a-uuid>"}';
set role authenticated;
select count(*) from public.trips;
-- Expected: only User A's trip count
reset role;

-- 3. User A cannot insert with User B's owner_id
set request.jwt.claims = '{"sub": "<user-a-uuid>"}';
set role authenticated;
insert into public.trips (slug, trip_data, owner_id)
  values ('test-rls', '{}', '<user-b-uuid>');
-- Expected: ERROR new row violates row-level security policy
reset role;

-- 4. User A cannot reassign owner_id on own trip
set request.jwt.claims = '{"sub": "<user-a-uuid>"}';
set role authenticated;
update public.trips set owner_id = '<user-b-uuid>'
  where id = (select id from public.trips where owner_id = '<user-a-uuid>' limit 1);
-- Expected: ERROR new row violates row-level security policy
reset role;

-- 5. User A cannot delete User B's trip
set request.jwt.claims = '{"sub": "<user-a-uuid>"}';
set role authenticated;
delete from public.trips where owner_id = '<user-b-uuid>';
-- Expected: 0 rows affected (USING prevents matching)
reset role;
```

## Review Checklist

- [x] `SELECT using (true)` is gone — replaced by `auth.uid() = owner_id`.
- [x] Policies use `auth.uid()` — trusted Supabase identity.
- [x] Public sharing is not implemented by opening the `trips` table.
- [x] Verification SQL covers anon, User A, and User B scenarios.
