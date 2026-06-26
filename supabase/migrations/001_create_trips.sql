-- Trips tabla
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  trip_data jsonb not null,
  owner text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index a slug-ra (gyors lookup)
create index if not exists idx_trips_slug on public.trips (slug);

-- RLS bekapcsolasa
alter table public.trips enable row level security;

-- Mindenki olvashat (publikus trip-ek)
create policy "Trips are publicly readable"
  on public.trips for select
  using (true);

-- Csak az owner irhat/torolhet (elokeszites — egyelore nincs auth)
create policy "Owner can insert trips"
  on public.trips for insert
  with check (true);

create policy "Owner can update own trips"
  on public.trips for update
  using (owner is null or owner = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Owner can delete own trips"
  on public.trips for delete
  using (owner is null or owner = current_setting('request.jwt.claims', true)::json->>'sub');

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trips_updated_at
  before update on public.trips
  for each row
  execute function public.handle_updated_at();
