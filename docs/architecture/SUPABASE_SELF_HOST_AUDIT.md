# Supabase Self-Host Feasibility Audit

Date: 2026-09-07
Task: `tasks/19-supabase-self-host-audit/19-01-supabase-self-host-feasibility-audit.md`
Status: audit complete, no infrastructure changed.

## Purpose

Decide whether Traveler stays on managed Supabase Free, upgrades to Pro, or
migrates to a self-hosted stack, and define a no-data-loss migration sequence
with a rollback path.

This document changes no code, no migration, no secret and no deployment
configuration.

## Target Host Profile

The candidate self-host machine is a Lenovo ThinkCentre M910q:

- Intel Core i3-7100T, 2 cores / 4 threads, 35 W
- 15.5 GiB RAM
- Ubuntu 24.04 LTS (Xubuntu, XFCE desktop)
- No discrete GPU (irrelevant; no local inference runs here)

Disk capacity was not captured and is an open question below.

## Supabase Dependency Inventory

### Frontend (`src/`)

| Dependency | Where | Notes |
| --- | --- | --- |
| `@supabase/supabase-js` client | `src/lib/supabase.ts` | Created only if both env vars are present; otherwise `null` and the app renders `DbError`. |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | `src/lib/supabase.ts` | The only two Supabase values exposed to the browser. |
| Supabase Auth | `src/context/AuthContext.tsx` | Email/password, session handling, `getSession()` for bearer tokens. |
| PostgREST reads/writes | `src/context/TripsContext.tsx` | Trip fetch and save through the JS client. |
| Typed schema | `src/types/supabase.ts` | Hand-maintained `Database` type, 5 tables + 1 function. |

### Server (`api/`, `server/`)

Service-role access for privileged operations. All handlers use the
platform-neutral `ApiRequest`/`ApiResponse` types, so nothing is tied to a
deploy platform.

### Services Required

| Supabase service | Required by Traveler? | Evidence |
| --- | --- | --- |
| Postgres | **Yes** | All trip, profile and sharing data. |
| Auth (GoTrue) | **Yes** | Email/password auth, `auth.users` referenced by triggers and a function. |
| REST (PostgREST) | **Yes** | All client reads/writes. |
| **Storage** | **No** | Zero `.storage` references in `src/` and `api/`. Ticket PDFs are static files in `public/tickets/`. |
| **Realtime** | **No** | Zero `.channel()` / subscription usage. |
| **Edge Functions** | **No** | All server logic runs in the app's own Node container. |
| Studio | Optional | Admin convenience only; can be run on demand. |

This matters: dropping Storage, Realtime, Edge Functions and the
analytics/vector logging layer removes the heaviest parts of the stock
self-host compose file.

## Database Object Inventory

From `supabase/migrations/` (12 migrations, 001–012). `011_keepalive.sql` and
`012_core_table_grants.sql` were added by tasks 19-02 and 19-03 after this audit
was first written.

### Tables (all in `public`, all with RLS enabled)

| Table | Migration | Purpose |
| --- | --- | --- |
| `trips` | 001, 003 | Trip rows, `trip_data` JSONB, `owner_id`. |
| `profiles` | 002, 009 | Display name, avatar, profile QR share id. |
| `trip_shares` | 005, 006 | Public share tokens: `token_hash` + `token_ciphertext` + key version. |
| `trip_share_recipients` | 007 | Account-to-account invites and their accept/decline/revoke state. |
| `trip_invite_email_events` | 010 | Invite email audit log. |

### Functions

| Function | Migration | Security |
| --- | --- | --- |
| `handle_new_user()` | 002 | `SECURITY DEFINER`, `search_path = ''`. Trigger on `auth.users` that creates the profile row. |
| `resolve_user_id_by_email(text)` | 008 | `SECURITY DEFINER`. Reads `auth.users`. Execute revoked from `public`, `anon`, `authenticated`; granted **only** to `service_role`. |

### Triggers

- `trips_updated_at` on `public.trips` (001)
- `profiles_updated_at` on `public.profiles` (002)
- `on_auth_user_created` on **`auth.users`** (002)

The third one is the critical migration detail: Traveler installs a trigger into
the `auth` schema, which GoTrue owns. Restore order must create `auth.users`
before this trigger, or profile creation silently breaks for new signups.

### Indexes And Constraints

Notable uniqueness rules that must survive migration:

- `idx_trips_owner_slug` — unique slug per owner (003), replacing the original
  global unique slug.
- `idx_trip_shares_one_unrevoked_per_trip` — at most one active share per trip.
- `idx_tsr_one_active_per_trip_recipient` — at most one active invite per
  trip/recipient pair.
- `idx_profiles_public_share_id` — unique profile QR id.

## RLS And Security Checklist

`supabase/verify_rls_policies.sql` exists as the verification script.

| Access path | Boundary that protects it |
| --- | --- |
| Owner reads/writes own trips | `trips` policies from 004 (`Users read/insert/update/delete own trips`), scoped to `auth.uid() = owner_id`. |
| Anonymous visitor on `/share/:token` | **Not** a `trips` policy. 004 explicitly dropped the public read policy. The share route runs server-side against `trip_shares` with a hashed token and returns a safe read-only projection. |
| Recipient of an account share | `trip_share_recipients` policies: owner reads own trip recipients, recipient reads own invites. Writes are `service_role` only. |
| Public demo `/demo` | No database access at all — static repo JSON (`docs/architecture/DEMO_TRIP_STRATEGY.md`). |
| Invite email log | `trip_invite_email_events` has RLS on with **no policies** and grants only to `service_role`, so `anon` and `authenticated` cannot read it. |
| Email → user id lookup | `resolve_user_id_by_email`, `service_role` execute only. |

Security invariants that a self-host migration must not weaken:

- `public.trips` must never regain a public `SELECT` policy.
- `service_role` key must never reach the browser (no `VITE_` prefix).
- Share tokens are stored hashed; the ciphertext exists only to re-display a
  token to its owner.

**Open item:** `18-13` live RLS verification against a real project with two
real users is still pending (`tasks/18-sharing-v2-account-qr.md`). See the
sequencing note in the recommendation.

## Managed Free vs Pro vs Self-Host

| Criterion | Managed Free | Managed Pro | Self-host on M910q |
| --- | --- | --- | --- |
| Monthly cost | 0 | Paid tier | Electricity only |
| Project pausing after inactivity | **Yes — the core problem** | No | No |
| Capacity for 10–20 users | Ample | Ample | Ample (see sizing) |
| Backups | Provider-managed | Provider-managed, longer retention | **Entirely your responsibility** |
| Upgrades and patching | Provider | Provider | You |
| Availability | Provider SLA | Provider SLA | Single box, home network, no redundancy |
| Auth email deliverability | Provider SMTP | Provider SMTP | Needs your own SMTP provider |
| Data residency / control | Provider | Provider | Full control |
| Ops effort | None | None | Ongoing |

### Sizing For The Target Host

Trimmed stack (no Realtime, no Storage, no imgproxy, no analytics/vector):

| Service | Approx. RAM |
| --- | --- |
| Postgres | 1–2 GB |
| GoTrue (auth) | ~100 MB |
| PostgREST | ~100 MB |
| Kong gateway | ~250 MB |
| Studio + postgres-meta (optional) | ~400 MB |
| Traveler app container | ~150 MB |
| **Total** | **~2–3 GB of 15.5 GiB** |

CPU is not a constraint. A trip planner with 10–20 users is a near-idle
workload, and all AI calls are proxied to Gemini, so no inference runs locally.

**Conclusion on capacity: the hardware is comfortably sufficient.** The risks of
self-hosting here are operational, not computational.

## Coolify Deployment Outline

The app already ships a self-hostable container: `docker-compose.yml` builds
`traveler-app`, binds `127.0.0.1:8787`, and has a `/healthz` healthcheck.

Outline (no production configuration is changed by this audit):

1. Deploy the trimmed Supabase stack as its own Coolify resource, on an internal
   Docker network, with only Kong exposed.
2. Keep the Traveler app as a separate resource that talks to Kong.
3. Terminate TLS at Coolify's proxy for both the app hostname and the Supabase
   API hostname.
4. Do not expose Postgres, Studio or postgres-meta to the internet. Reach Studio
   over SSH tunnel or a private network only.
5. Persist Postgres data on a named volume with a documented host path, so
   backups have a stable target.

## Secrets And Environment Mapping

Current variables, from the codebase.

### Frontend (browser-visible, `VITE_` prefix)

| Variable | Managed today | Self-host value |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` | Your Kong hostname |
| `VITE_SUPABASE_ANON_KEY` | Managed anon JWT | **New** anon JWT signed with your JWT secret |

### Server-side (never `VITE_`)

| Variable | Changes on migration? |
| --- | --- |
| `SUPABASE_URL` | **Yes** — new hostname |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** — new service JWT |
| `SHARE_TOKEN_ENCRYPTION_KEY` | **No — must be carried over unchanged** |
| `GEMINI_API_KEY` | No |
| `RESEND_API_KEY`, `INVITE_EMAIL_FROM` | No |
| `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BACKUP_BRANCH` | No |
| `ADMIN_PASSWORD`, `ADMIN_USER_ID` | No (`ADMIN_USER_ID` only if user ids change — they must not) |
| `APP_PUBLIC_URL` | Only if the public hostname changes |
| `PORT` | No |

### Two Secrets That Deserve Special Care

1. **`SHARE_TOKEN_ENCRYPTION_KEY`.** `api/_share-crypto.ts` maps key version 1
   to this variable. If it is regenerated instead of copied, every existing
   `token_ciphertext` becomes undecryptable and owners can no longer re-display
   their existing share links. Carry the exact value across.
2. **JWT secret.** Self-hosting means a new JWT secret, therefore new anon and
   service-role keys, therefore **every existing browser session is
   invalidated** and all users must log in again. This is expected, but it must
   be communicated rather than discovered.

### New Self-Host-Only Configuration

Not currently needed on managed, required after migration:

- GoTrue `SITE_URL` and `URI_ALLOW_LIST` — currently configured in the Supabase
  dashboard per `docs/architecture/AUTH_SETUP.md` (site URL
  `https://traveler.zsoltadel.go.ro`, plus the `/auth/callback` redirect).
- **GoTrue SMTP settings.** This is easy to miss: `RESEND_API_KEY` covers the
  app's own invite emails only. Signup confirmation and password reset are sent
  by GoTrue itself, and on managed Supabase that uses the provider's SMTP. Self
  hosting means wiring GoTrue to a real SMTP provider — Resend can serve both,
  but it must be configured explicitly. A residential IP cannot send this mail
  reliably.
- GoTrue rate limits, replacing the managed defaults documented in
  `AUTH_SETUP.md` (email signups: 3 per hour per IP).

## Backup And Restore Plan

### What Today's Backup Does Not Cover

The existing GitHub backup (`api/backup-trips.ts`) exports `trip_data` only. It
does **not** contain:

- `auth.users` — every account, password hash and email confirmation state
- `profiles`
- `trip_shares` and their ciphertexts
- `trip_share_recipients`
- `trip_invite_email_events`

Treating the GitHub backup as a migration safety net would silently lose every
account and every share. It is a content backup, not a system backup.

### Required Backup Procedure

1. Full logical dump including the `auth` schema, roles and grants.
2. Separate dump of `public` only, as a convenience restore target.
3. Verify the dump restores into a scratch database **before** any cutover.
4. Store dumps off the host machine where possible. **Decided 2026-09-09:** no
   off-host target exists yet, so dumps stay on the host with enforced
   retention. Trip content is separately safe in the GitHub trip backup, so the
   uniquely exposed data is accounts, profiles and share links.
5. After cutover, establish a scheduled dump with retention and at least one
   documented restore test.

### Restore Ordering Constraint

Because `on_auth_user_created` is a trigger on `auth.users`, restore must bring
up GoTrue's `auth` schema first, then application objects. Restoring `public`
against a missing `auth.users` will fail or, worse, leave the profile trigger
absent while everything else appears healthy.

## No-Data-Loss Migration Sequence

Every step before step 9 is reversible and touches nothing in production.

1. Capture disk, network and hostname facts about the target host.
2. Stand up the trimmed Supabase stack locally with throwaway secrets. No real
   data.
3. Apply `supabase/migrations/001` … `012` in order against the empty stack.
   Migration 012 carries the `trips` and `profiles` table grants that used to
   exist only in `CLAUDE.md` prose.
4. Run `supabase/verify_rls_policies.sql` and confirm it passes on the new
   stack.
5. Take a full dump of the managed project, including `auth`.
6. Restore that dump into the self-host stack — a **copy**, with production
   still live and untouched.
7. Point a local build at the self-host stack using its new keys, carrying
   `SHARE_TOKEN_ENCRYPTION_KEY` across unchanged. Exercise: signup, login,
   password reset, trip create/edit/delete, public share link, account invite
   accept and decline, admin backup.
8. Run the pending `18-13` live RLS verification against this stack with two
   real users.
9. **Cutover.** Freeze writes, take a final delta dump, restore it, switch DNS
   and env vars, invalidate sessions.
10. Keep the managed project intact and paid-for until the rollback window
    closes.

Steps 1–8 can all be done without any production risk. That is the bulk of the
work.

## Rollback Plan

Rollback stays trivial as long as the managed project is not deleted:

1. Revert `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` to the managed values.
2. Redeploy the app.
3. Users log in again (the JWT secret differs in each direction).

The cost of rollback is any data written to the self-host stack after cutover.
Keep the cutover window short and announce it, or accept re-importing that
delta.

**Do not delete the managed project** until the self-host stack has survived a
documented restore test and a reasonable observation period.

## Open Questions And Blocked Items

Host facts captured 2026-09-09.

| Item | Status |
| --- | --- |
| Disk | **Resolved, with a caveat.** 238.5 GB NVMe SSD, 63 GB free, 72% used. See the disk note below. |
| Static IP | **Resolved.** Fixed IP. |
| TLS and reverse proxy | **Resolved.** Coolify already runs at `https://coolify.jeneizsolt.com/`, so its proxy and Let's Encrypt integration handle certificates for both the app and the Supabase API hostname. |
| RAM headroom | **Resolved.** 15 GiB total, ~12 GiB available. Note 2 GiB of the 4 GiB swap is already in use. |
| SMTP provider for GoTrue | **Open.** Resend is already a dependency and is the obvious candidate, but it must be configured explicitly. |
| Off-host backup destination | **Decided 2026-09-09: none for now.** Dumps stay on the ThinkCentre, with enforced retention. Accepted risk, recorded in 19-04. |
| Power and network outage tolerance | Accepted for the current stage; revisit at 20-11. |
| `18-13` live RLS verification | Moved into 19-05, to be run once against the self-host stack. |

### Disk Note

63 GB free is enough for the workload but not comfortable on a disk already at
72%. The database itself is negligible: trip rows are JSONB, and 10-20 users
produce tens of megabytes, not gigabytes. The trimmed Supabase images add
roughly 2 GB.

The actual risk is Docker build cache. Coolify builds images on this host, and
every redeploy of the Traveler app leaves layers behind. That is the mechanism
that quietly fills a disk over months, not the application data.

Mitigations to put in place during 19-03:

- a scheduled `docker system prune` with a retention window
- a disk usage alert well before the disk is full, because Postgres handles a
  full disk badly
- keep database dumps off this machine, which is required anyway

Swap being half used while 5.9 GiB of RAM is free suggests earlier memory
pressure from the desktop session. It is not a blocker, but Postgres should not
be allowed to swap; consider a low `vm.swappiness` on a host that runs a
database.

## Final Recommendation

**Migrate to self-host for the current stage, but stage it and do not rush the
cutover.**

Reasoning, separated by concern as the task requires:

- **Cost.** Free-plan pausing is a real product defect now that a public landing
  page and demo exist, and there is currently **no keepalive of any kind** in the
  repository. Self-hosting removes the pausing problem at no monthly cost. Pro
  also removes it, for money.
- **Capacity.** Not a differentiator. The trimmed stack needs ~2–3 GB of 15.5
  GiB, and 10–20 users is a near-idle workload. The hardware is fine.
- **Maintenance.** This is the real price. Patching, upgrades, certificate
  renewal, backup verification and outage response all become yours. Managed
  removes all of it.
- **Security.** Neutral if done correctly. The RLS model is sound and portable,
  but two secrets need deliberate handling (`SHARE_TOKEN_ENCRYPTION_KEY` carried
  over, JWT secret regenerated), and Postgres and Studio must not be exposed.
- **Reliability.** The weakest point. One machine, one home network, no
  redundancy.

Therefore:

1. Do steps 1–8 of the migration sequence now. They are risk-free and produce a
   working, verified self-host stack running on a copy of the data.
2. **Run `18-13` on the self-host stack, not on managed.** Running it on managed
   first means running it twice, since the RLS verification would have to be
   repeated on the new stack anyway.
3. Keep the managed project intact as the rollback source until the rollback
   window closes. Do not add a keepalive workflow now that the decision is to
   cut over to self-host; a paused managed project is recoverable from the
   dashboard and is no longer the production target.
4. Revisit this decision when Phase 20's subscription and billing epic (20-11)
   becomes real. Paying customers on a single home machine with no redundancy is
   a different risk conversation, and this document should not be read as
   pre-approving that.

## Reference Documentation

The following official sources should be re-checked at execution time; the
stack's compose file and required environment variables change between Supabase
releases, and no version-specific claims in this audit should be trusted without
confirming against the current docs:

- Supabase self-hosting overview and Docker guide:
  `https://supabase.com/docs/guides/self-hosting`
  `https://supabase.com/docs/guides/self-hosting/docker`
- GoTrue (Auth) server configuration, including SMTP and redirect allow lists:
  `https://supabase.com/docs/guides/auth`
- Database backup and restore guidance:
  `https://supabase.com/docs/guides/platform/backups`

These links were recorded from the task's requirement to cite sources; they were
not fetched during this audit session.

## Change Record

This audit changed no application behavior, no migration, no secret and no
deployment configuration, as required by the task's acceptance criteria.
