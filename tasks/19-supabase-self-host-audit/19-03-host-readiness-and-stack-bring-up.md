# 19-03 — Host Readiness And Trimmed Stack Bring-Up

**Estimate:** 3-5 hours

## Goal

Stand up a trimmed Supabase stack on the target host using throwaway secrets and
no real data, and apply the existing migrations to it.

This is migration sequence steps 1-4 from the audit. Nothing in production is
touched.

## Prerequisites

Host facts captured 2026-09-09 and recorded in the audit:

- 238.5 GB NVMe SSD, **63 GB free, disk already at 72%**
- 15 GiB RAM, ~12 GiB available (2 GiB of 4 GiB swap in use)
- Fixed IP
- Coolify already running at `https://coolify.jeneizsolt.com/`, so its proxy
  and Let's Encrypt integration cover TLS

Still open: SMTP provider for GoTrue, and the off-host backup destination. The
latter blocks 19-04, not this task.

## Scope

- Start from the current upstream Supabase self-host compose file. Do not
  hand-write service definitions from memory; image tags and required
  environment variables change between releases.
- Remove the services the audit proved unused: Realtime, Storage, imgproxy, and
  the analytics/vector logging layer.
- Keep Postgres, GoTrue, PostgREST, Kong. Studio and postgres-meta are optional
  and must not be internet-exposed.
- Apply the migrations and verify with `pnpm run db:migrate` (script:
  `scripts/apply-migrations.sh`). It applies `001` … `012` in order and then
  runs the structural half of `verify_rls_policies.sql` as pass/fail
  assertions, including the `on_auth_user_created` trigger check.
- Add a scheduled `docker system prune` and a disk usage alert. At 72% used,
  Coolify build cache is the realistic way this host runs out of space.
- The table GRANTs come from migration 012; no manual grant step is needed.

## Table GRANTs Are Now A Migration

This used to be a manual step and is no longer one. Recorded here because the
failure mode is worth knowing.

`trip_shares` (005), `trip_share_recipients` (007) and
`trip_invite_email_events` (010) each granted their own table privileges. The
`trips` and `profiles` tables did not: they relied on Supabase default
privileges, and the `trips` grants existed only in `CLAUDE.md` step 3 prose.

A stack built from migrations alone could therefore come up without them, and
the failure is deceptive — schema, policies and triggers all look correct, but
every logged-in user hits a permission error on their own trips, because
Postgres applies table privileges **before** RLS.

`supabase/migrations/012_core_table_grants.sql` now carries these grants, so the
order of operations is simply:

1. Bring up the stack.
2. `pnpm run db:migrate` — applies `001` … `012` and then asserts, including
   the grant assertions, which now pass because 012 created them.

`GRANT` is idempotent in Postgres, so 012 is also safe to run against the
existing managed project.

## Acceptance Criteria

- All 12 migrations (`001` … `012`) apply cleanly to an empty database, in
  order.
- `verify_rls_policies.sql` passes on the new stack.
- Only Kong is reachable from outside the host.
- Postgres data lives on a named volume with a documented host path.
- Throwaway secrets only; no production value is used in this task.
- `pnpm run db:migrate` exits zero on the first run, including both
  `grant present` assertions.
- Disk pruning and alerting are in place before real data is restored.

## Output

Pending.
