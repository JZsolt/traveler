-- Replace permissive RLS policies with owner-scoped policies.
-- Service-role clients (backup, import, seed) bypass RLS automatically.

-- Guard: abort if any trip still has owner_id IS NULL.
-- Run the backfill from 003 first:
--   UPDATE public.trips SET owner_id = '<admin-user-uuid>' WHERE owner_id IS NULL;
do $$
begin
  if exists (select 1 from public.trips where owner_id is null) then
    raise exception 'Backfill owner_id before enabling owner-scoped RLS — run: UPDATE public.trips SET owner_id = ''<admin-uuid>'' WHERE owner_id IS NULL;';
  end if;
end $$;

-- Backfill passed — lock down the column
alter table public.trips alter column owner_id set not null;

-- Drop all legacy policies from 001_create_trips.sql
drop policy if exists "Trips are publicly readable" on public.trips;
drop policy if exists "Owner can insert trips" on public.trips;
drop policy if exists "Owner can update own trips" on public.trips;
drop policy if exists "Owner can delete own trips" on public.trips;

-- SELECT: users can only read their own trips
create policy "Users read own trips"
  on public.trips for select
  using (auth.uid() = owner_id);

-- INSERT: users can only insert trips owned by themselves
create policy "Users insert own trips"
  on public.trips for insert
  with check (auth.uid() = owner_id);

-- UPDATE: users can only update their own trips;
-- with check prevents owner_id reassignment to another user
create policy "Users update own trips"
  on public.trips for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- DELETE: users can only delete their own trips
create policy "Users delete own trips"
  on public.trips for delete
  using (auth.uid() = owner_id);
