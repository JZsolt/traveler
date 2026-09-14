-- Tabla-szintu GRANT-ok a trips es profiles tablakra.
--
-- Miert kell ez a migracio:
-- A trip_shares (005), trip_share_recipients (007) es trip_invite_email_events
-- (010) sajat migracioban kapta meg a grantjeit. A trips es a profiles NEM:
-- azok eddig a Supabase default privileges-ere tamaszkodtak, a trips grantjai
-- pedig csak a CLAUDE.md 3. lepesenek szovegeben leteztek.
--
-- Egy migraciokbol felepitett self-host stack igy grant nelkul maradhat. Ilyenkor
-- a sema, a policyk es a triggerek mind helyesnek latszanak, de minden
-- bejelentkezett user permission errort kap a sajat tripjere -- a Postgres a
-- tabla-jogosultsagot az RLS ELOTT alkalmazza.
--
-- A GRANT idempotens: mar meglevo jogosultsag ujboli megadasa no-op, ezert ez a
-- migracio a meglevo managed projekten is biztonsagosan lefuttathato.
--
-- FONTOS: ez nem lazit a biztonsagon. A hozzaferest tovabbra is az RLS donti el
-- (004 ota minden trips policy auth.uid() = owner_id). A grant csak azt engedi
-- meg, hogy a szerep egyaltalan hozzanyulhasson a tablahoz.

-- trips: a CLAUDE.md 3. lepesenek grantjai, valtozatlanul atemelve.
grant all on public.trips to service_role;
grant all on public.trips to authenticated;
-- Az anon SELECT megorzi a jelenlegi viselkedest. A 004 ota az anon nulla sort
-- illeszt (nincs ra permissive policy), tehat ez nem tesz lathatova adatot.
-- Nyitott kerdes kesobbre: szukseges-e egyaltalan.
grant select on public.trips to anon;

-- profiles: a 002 policyi szerint a user olvassa/irja a sajat profiljat.
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
