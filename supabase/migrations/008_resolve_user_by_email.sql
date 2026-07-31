-- Sharing V2: biztonsagos, szerver-oldali email -> user_id feloldas a recipient
-- meghivashoz. SECURITY DEFINER, hogy elerje az auth.users-t, de CSAK a service_role
-- hivhatja — igy a kliensrol NINCS user-enumeration. Nem szivarogtat profil adatot,
-- csak a user id-t adja vissza (vagy null), amit a szerver hasznal fel.

create or replace function public.resolve_user_id_by_email(p_email text)
returns uuid
language sql
security definer
set search_path = ''
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

revoke all on function public.resolve_user_id_by_email(text) from public;
revoke all on function public.resolve_user_id_by_email(text) from anon;
revoke all on function public.resolve_user_id_by_email(text) from authenticated;
grant execute on function public.resolve_user_id_by_email(text) to service_role;
