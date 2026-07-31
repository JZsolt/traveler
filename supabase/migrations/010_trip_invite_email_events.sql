-- Sharing V2: transactional invite email audit + server-side rate limit source.
-- Csak service_role irja/olvassa; kliens nem kap grantet.

create table if not exists public.trip_invite_email_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  recipient_email text not null,
  status text not null check (status in ('sent', 'duplicate', 'rate_limited', 'provider_failed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_tiee_owner_created_at
  on public.trip_invite_email_events (owner_id, created_at desc);

create index if not exists idx_tiee_trip_created_at
  on public.trip_invite_email_events (trip_id, created_at desc);

create index if not exists idx_tiee_trip_email_created_at
  on public.trip_invite_email_events (trip_id, recipient_email, created_at desc);

alter table public.trip_invite_email_events enable row level security;

grant select, insert on public.trip_invite_email_events to service_role;
