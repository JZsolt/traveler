-- Sharing V2: account-to-account sharing. A recipient sor CSAK feloldott, letezo
-- app-user-hez jon letre (recipient_user_id NOT NULL). NINCS onallo, email-alapon
-- kesobb "megigenyelheto" sor. A recipient a trip TARTALMAT NEM innen olvassa: nincs
-- semmilyen trips SELECT policy — a shared-with-me endpoint (18-07) projektalja.

create table if not exists public.trip_share_recipients (
  id uuid primary key default gen_random_uuid(),
  -- on delete cascade: trip torlesekor a recipient sorok elvesznek (nincs orphan,
  -- a recipient elveszti a hozzaferest).
  trip_id uuid not null references public.trips(id) on delete cascade,
  -- on delete set null: a meghivast seedelo public share informativ; a recipient
  -- (account) hozzaferese fuggetlen a public link eletciklusatol (revoke/regenerate).
  share_id uuid references public.trip_shares(id) on delete set null,
  -- on delete cascade: owner torlesekor a meghivasai ertelmetlenne valnak.
  owner_id uuid not null references auth.users(id) on delete cascade,
  -- on delete cascade: recipient torlesekor a sorai elvesznek (nincs orphan).
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  -- CSAK a feloldott recipient_user_id melle, megjelenites/audit/dedup celbol.
  recipient_email text,
  created_at timestamptz not null default now(),
  accepted_at timestamptz null,
  declined_at timestamptz null,
  revoked_at timestamptz null,
  constraint tsr_accepted_after_created check (accepted_at is null or accepted_at >= created_at),
  constraint tsr_declined_after_created check (declined_at is null or declined_at >= created_at),
  constraint tsr_revoked_after_created check (revoked_at is null or revoked_at >= created_at),
  -- Allapotmodell: elfogadott ES elutasitott egyszerre ertelmetlen (kizarolagos).
  -- (accepted + revoked megengedett: owner egy elfogadott meghivast is visszavonhat;
  -- az "aktiv" allapotot a lekerdezes definialja: accepted_at not null AND revoked_at
  -- is null AND declined_at is null.)
  constraint tsr_accepted_declined_exclusive check (
    not (accepted_at is not null and declined_at is not null)
  )
);

-- Duplikatum-vedelem: trip-enkent es recipient-enkent legfeljebb EGY aktiv (nem
-- visszavont, nem elutasitott) meghivas. Elutasitott/visszavont sorok maradhatnak
-- (elozmeny), es utananuk uj meghivas kereheto.
create unique index if not exists idx_tsr_one_active_per_trip_recipient
  on public.trip_share_recipients (trip_id, recipient_user_id)
  where revoked_at is null and declined_at is null;

-- Owner-menedzsment (trip szerinti recipient lista) es owner osszes meghivasa.
create index if not exists idx_tsr_trip_id_created_at
  on public.trip_share_recipients (trip_id, created_at desc);
create index if not exists idx_tsr_owner_id
  on public.trip_share_recipients (owner_id);

-- Recipient dashboard (a sajat meghivasai / megosztott utazasai).
create index if not exists idx_tsr_recipient_user_id
  on public.trip_share_recipients (recipient_user_id, created_at desc);

alter table public.trip_share_recipients enable row level security;

-- MINDEN mutacio (invite/accept/decline/revoke) szerver endpointon at, service
-- role-lal tortenik (18-06), ahol a lifecycle-atmenetek kikenyszerithetok. Az
-- authenticated (kliens) csak OLVASHAT (RLS-scoped) — igy a recipient NEM tud
-- pl. owner altal visszavont invite-ot ujraaktivalni, sem lifecycle mezot
-- inkonzisztensre allitani.
grant select on public.trip_share_recipients to authenticated;
grant select, insert, update, delete on public.trip_share_recipients to service_role;

drop policy if exists "Owner reads own trip recipients" on public.trip_share_recipients;
drop policy if exists "Owner inserts recipients for own trips" on public.trip_share_recipients;
drop policy if exists "Owner updates own trip recipients" on public.trip_share_recipients;
drop policy if exists "Owner deletes own trip recipients" on public.trip_share_recipients;
drop policy if exists "Recipient reads own invites" on public.trip_share_recipients;
drop policy if exists "Recipient updates own invites" on public.trip_share_recipients;

-- Csak SELECT policy-k: owner a sajat trip-jeihez tartozo sorokat, recipient a
-- sajat meghivas-sorait olvashatja. Nincs authenticated INSERT/UPDATE/DELETE
-- policy — az irast a service role vegzi az endpointokban.
create policy "Owner reads own trip recipients"
  on public.trip_share_recipients for select
  using (owner_id = auth.uid());

create policy "Recipient reads own invites"
  on public.trip_share_recipients for select
  using (recipient_user_id = auth.uid());
