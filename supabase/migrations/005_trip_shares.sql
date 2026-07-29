-- Revocable public share links for trips.
-- Raw share tokens are never stored; only token_hash is persisted.

create table if not exists public.trip_shares (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  token_hash text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz null,
  revoked_at timestamptz null,
  constraint trip_shares_token_hash_unique unique (token_hash),
  constraint trip_shares_expires_after_created check (
    expires_at is null or expires_at > created_at
  ),
  constraint trip_shares_revoked_after_created check (
    revoked_at is null or revoked_at >= created_at
  )
);

-- Token lookup is covered by the unique token_hash constraint.
-- Trip management lists use trip_id and active-share filters.
create index if not exists idx_trip_shares_trip_id_created_at
  on public.trip_shares (trip_id, created_at desc);

create index if not exists idx_trip_shares_active_by_trip
  on public.trip_shares (trip_id, created_at desc)
  where revoked_at is null;

-- PostgreSQL cannot enforce "unexpired" with now() in a partial unique index.
-- The endpoint revokes expired rows before insert, and this prevents races.
create unique index if not exists idx_trip_shares_one_unrevoked_per_trip
  on public.trip_shares (trip_id)
  where revoked_at is null;

create index if not exists idx_trip_shares_created_by
  on public.trip_shares (created_by);

alter table public.trip_shares enable row level security;

grant select, insert, update, delete on public.trip_shares to authenticated;
grant select, insert, update, delete on public.trip_shares to service_role;

drop policy if exists "Users read own trip shares" on public.trip_shares;
drop policy if exists "Users insert own trip shares" on public.trip_shares;
drop policy if exists "Users update own trip shares" on public.trip_shares;
drop policy if exists "Users delete own trip shares" on public.trip_shares;

-- SELECT: users can only read share rows for trips they own.
create policy "Users read own trip shares"
  on public.trip_shares for select
  using (
    exists (
      select 1
      from public.trips
      where trips.id = trip_shares.trip_id
        and trips.owner_id = auth.uid()
    )
  );

-- INSERT: users can only create share rows for trips they own.
create policy "Users insert own trip shares"
  on public.trip_shares for insert
  with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.trips
      where trips.id = trip_shares.trip_id
        and trips.owner_id = auth.uid()
    )
  );

-- UPDATE: users can revoke or edit metadata only for shares on their own trips.
create policy "Users update own trip shares"
  on public.trip_shares for update
  using (
    exists (
      select 1
      from public.trips
      where trips.id = trip_shares.trip_id
        and trips.owner_id = auth.uid()
    )
  )
  with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.trips
      where trips.id = trip_shares.trip_id
        and trips.owner_id = auth.uid()
    )
  );

-- DELETE: users can only delete share rows for trips they own.
create policy "Users delete own trip shares"
  on public.trip_shares for delete
  using (
    exists (
      select 1
      from public.trips
      where trips.id = trip_shares.trip_id
        and trips.owner_id = auth.uid()
    )
  );
