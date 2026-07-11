-- Profiles tabla — auth.users-hez kapcsolt alkalmazas-szintu profil
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS bekapcsolasa
alter table public.profiles enable row level security;

-- Felhasznalo csak a sajat profiljat olvassa
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Felhasznalo csak a sajat profiljat modositsa
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Felhasznalo csak a sajat profiljat hozhassa letre (bootstrap)
create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-update updated_at (ujrahasznaljuk a meglevo handle_updated_at fuggvenyt)
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Automatikus profil letrehozas auth.users insert eseten
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = '';

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
