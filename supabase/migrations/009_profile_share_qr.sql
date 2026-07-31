-- Sharing V2: opt-in profile QR celzas account-to-account meghivasokhoz.
-- A public_share_id nem email es nem user UUID; szerver generalja, rotalhato.

alter table public.profiles
  add column if not exists public_share_id text,
  add column if not exists profile_share_enabled boolean not null default false,
  add column if not exists profile_share_rotated_at timestamptz;

create unique index if not exists idx_profiles_public_share_id
  on public.profiles (public_share_id)
  where public_share_id is not null;

alter table public.profiles
  drop constraint if exists profiles_public_share_id_format;

alter table public.profiles
  add constraint profiles_public_share_id_format
  check (
    public_share_id is null
    or (
      char_length(public_share_id) between 32 and 80
      and public_share_id ~ '^[A-Za-z0-9_-]+$'
    )
  );
