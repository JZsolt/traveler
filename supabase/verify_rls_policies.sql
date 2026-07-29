-- RLS Policy Verification Queries
-- Run these against a Supabase instance to verify trip isolation and owner-scoped policies.
-- Requires two test users (User A and User B) with trips in the database.
--
-- Usage: run each section in the Supabase SQL Editor as the appropriate role.

-- ============================================================
-- 1. Verify RLS is enabled on trips table
-- ============================================================
select
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public' and tablename = 'trips';
-- Expected: rls_enabled = true

-- ============================================================
-- 2. Verify all 4 owner-scoped policies exist
-- ============================================================
select policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'trips'
order by policyname;
-- Expected: 4 policies (select, insert, update, delete), each with auth.uid() = owner_id

-- ============================================================
-- 3. Verify legacy permissive policies are gone
-- ============================================================
select count(*) as legacy_policies
from pg_policies
where schemaname = 'public'
  and tablename = 'trips'
  and policyname in (
    'Trips are publicly readable',
    'Owner can insert trips',
    'Owner can update own trips',
    'Owner can delete own trips'
  );
-- Expected: 0

-- ============================================================
-- 4. Verify owner_id is NOT NULL
-- ============================================================
select column_name, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'trips'
  and column_name = 'owner_id';
-- Expected: is_nullable = 'NO'

-- ============================================================
-- 5. Trip isolation: User A cannot see User B's trips
--    Run as User A (set role + auth.uid):
-- ============================================================
-- Replace <USER_A_UUID> and <USER_B_UUID> with actual UUIDs.
--
-- set local role authenticated;
-- set local request.jwt.claims to '{"sub": "<USER_A_UUID>"}';
--
-- select count(*) as visible_trips
-- from public.trips
-- where owner_id = '<USER_B_UUID>';
-- -- Expected: 0

-- ============================================================
-- 6. Owner spoofing: User A cannot INSERT a trip owned by User B
-- ============================================================
-- set local role authenticated;
-- set local request.jwt.claims to '{"sub": "<USER_A_UUID>"}';
--
-- insert into public.trips (slug, trip_data, owner_id)
-- values ('spoofed-trip', '{}', '<USER_B_UUID>');
-- -- Expected: ERROR new row violates row-level security policy

-- ============================================================
-- 7. Owner reassignment: User A cannot UPDATE owner_id to User B
-- ============================================================
-- set local role authenticated;
-- set local request.jwt.claims to '{"sub": "<USER_A_UUID>"}';
--
-- update public.trips
-- set owner_id = '<USER_B_UUID>'
-- where id = (select id from public.trips where owner_id = '<USER_A_UUID>' limit 1);
-- -- Expected: ERROR new row violates row-level security policy

-- ============================================================
-- 8. Cross-user delete: User A cannot DELETE User B's trips
-- ============================================================
-- set local role authenticated;
-- set local request.jwt.claims to '{"sub": "<USER_A_UUID>"}';
--
-- delete from public.trips
-- where owner_id = '<USER_B_UUID>';
-- -- Expected: 0 rows affected

-- ============================================================
-- 9. Anon cannot read any trips
-- ============================================================
-- set local role anon;
--
-- select count(*) from public.trips;
-- -- Expected: 0

-- ============================================================
-- 10. Composite unique index: same slug allowed for different owners
-- ============================================================
select indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'trips'
  and indexname = 'idx_trips_owner_slug';
-- Expected: CREATE UNIQUE INDEX idx_trips_owner_slug ON public.trips USING btree (owner_id, slug)
