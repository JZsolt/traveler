-- Trip ownership migration: owner text -> owner_id uuid

-- 1. Add owner_id column (nullable initially for backfill)
alter table public.trips
  add column if not exists owner_id uuid references auth.users(id);

-- 2. Index for owner-scoped queries
create index if not exists idx_trips_owner_id on public.trips (owner_id);

-- 3. Backfill: assign all existing trips to the configured initial owner.
--    Run this manually after creating the first admin user:
--
--    UPDATE public.trips SET owner_id = '<admin-user-uuid>' WHERE owner_id IS NULL;
--
--    After backfill, make owner_id NOT NULL:
--
--    ALTER TABLE public.trips ALTER COLUMN owner_id SET NOT NULL;

-- 4. Replace slug unique constraint with per-user unique
--    (different users may have the same slug)
--    First drop the old unique constraint/index, then add composite.
--    Note: the original CREATE TABLE used "slug text unique not null"
--    which creates an implicit unique constraint.
alter table public.trips drop constraint if exists trips_slug_key;
create unique index if not exists idx_trips_owner_slug
  on public.trips (owner_id, slug);

-- 5. Deprecate owner text column.
--    After confirming nothing reads it, run:
--
--    ALTER TABLE public.trips DROP COLUMN owner;
--
--    This is left manual to avoid data loss during staged rollout.
