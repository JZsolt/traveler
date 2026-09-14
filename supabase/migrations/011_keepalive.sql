-- Keepalive endpoint a managed Supabase Free projekt szuneteltetese ellen.
--
-- Eredetileg a managed Supabase Free keepalive tervhez keszult. A workflow vegul
-- nem maradt meg, mert a projekt self-host cutoverre megy tovabb. Szandekosan
-- NEM a trips tablat pingelte volna: az privat adat, es az anon hozzaferese
-- kizarolag az RLS policyken mulik. Egy dedikalt fuggveny explicit,
-- auditalhato, es semmilyen adatot nem ad vissza.
--
-- Torolheto, amint a managed projekt nyugdijba megy (19-06).

create or replace function public.keepalive()
returns text
language sql
stable
as $$
  select 'ok'::text;
$$;

comment on function public.keepalive() is
  'Legacy managed keepalive RPC. Unused after self-host cutover decision; returns a constant and reads no data. See 19-02.';

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;
