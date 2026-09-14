# 19-02 — Managed Project Keepalive ⛔ SUPERSEDED

**Estimate:** 30-45 minutes

## Goal

Stop the managed Supabase Free project from pausing while the self-host
migration is being prepared. This protects the public landing page and demo
today, independently of the migration outcome.

## Context

`docs/architecture/SUPABASE_SELF_HOST_AUDIT.md` found no keepalive of any kind
in the repository. A paused project means the app renders `DbError` for every
visitor, including anonymous visitors on the public landing page.

## Scope

- Add a scheduled, minimal-cost query against the managed project.
- Prefer a GitHub Actions schedule over a host-dependent cron, so the keepalive
  does not depend on the machine being migrated.
- The query must touch a table without reading user content. A `count` against
  a small table is sufficient.
- Use the anon key or a dedicated low-privilege path. Do not put the service
  role key into a workflow that does not need it.

## Acceptance Criteria

- The schedule runs often enough to prevent pausing.
- No secret value appears in logs or in committed files.
- Failure of the keepalive is visible, not silent.
- Removing the keepalive after migration is a single documented step.

## Status

**Superseded on 2026-09-10 by the decision to migrate fully.** Do not wire this
up.

A self-hosted Postgres does not pause, so the keepalive has no purpose after the
migration, and the migration is now going ahead rather than being weighed
against staying on the Free plan.

What this means concretely:

- `.github/workflows/supabase-keepalive.yml` was removed and should **not** be
  committed.
- The two Actions secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) should not be
  created for this purpose.
- `supabase/migrations/011_keepalive.sql` has already been applied to the managed
  project. It is harmless and disappears when that project is retired. It is
  left in place rather than reverted, since removing it would be churn for no
  benefit.
- If the migration drags on, a paused Free project is **not data loss** — it
  resumes from the dashboard with one click. The keepalive was convenience, not
  protection.

The one part of this task that mattered turned out to be a side effect: it
surfaced that the `trips` and `profiles` table grants existed only in
`CLAUDE.md` prose, which produced `012_core_table_grants.sql`. That migration is
required for the self-host stack and is applied.

## Output

No keepalive workflow is kept.

The prototype workflow was discarded after the project moved from "keep managed
Free alive" to "cut over to self-host". A self-hosted Postgres stack does not
pause, so keeping a scheduled GitHub Action would add secrets, noise and future
confusion without protecting production.

### What remains

- `supabase/migrations/011_keepalive.sql` remains in the migration list. It
  creates a harmless constant-returning RPC and can disappear with the managed
  project at retirement.
- `supabase/migrations/012_core_table_grants.sql` remains required. It is the
  real output that came from this task's investigation.

### Removal

Nothing to remove later. The workflow file is not part of the final plan.
