# 19-01 — Supabase Self-Host Feasibility Audit

**Estimate:** 2-4 hours

## Goal

Create a grounded decision document for managed Supabase Free, Supabase Pro, and
self-hosted Supabase, focused on the current Traveler codebase and deployment
model.

## Scope

- Inventory every Supabase dependency in the app and server code.
- Inventory all database migrations, RLS policies, functions, and security
  assumptions under `supabase/`.
- Identify required self-host services: Postgres, Auth, REST, Realtime if used,
  Storage if used, Studio, gateway/reverse proxy, SMTP, backups, and logs.
- Define environment variable changes for frontend and server runtime.
- Define Coolify/Docker deployment options without editing production
  configuration.
- Define backup, restore, and rollback steps.
- Document known differences between managed Supabase Free, Supabase Pro, and
  self-hosted Supabase.
- Produce a recommendation: stay Free with keepalive, upgrade to Pro, or prepare
  self-host migration.

## Files To Read

- `tasks/PROJECT_RULES.md`
- `docker-compose.yml`
- `src/lib/supabase.ts`
- `src/context/AuthContext.tsx`
- `src/context/TripsContext.tsx`
- `src/types/supabase.ts`
- `supabase/migrations/`
- `supabase/verify_rls_policies.sql`
- `docs/architecture/AUTH_SETUP.md`
- `docs/architecture/AUTH_SPEC.md`
- `docs/architecture/SHARING_SPEC.md`
- `docs/architecture/SHARING_V2_SPEC.md`
- `docs/architecture/SHARING_V2_SECURITY_CHECKLIST.md`
- `tasks/18-sharing-v2-account-qr.md`

## Output

Create:

- `docs/architecture/SUPABASE_SELF_HOST_AUDIT.md`

The document must include:

- Current Supabase dependency inventory.
- Database object inventory.
- RLS/security checklist.
- Managed Free vs Pro vs self-host decision matrix.
- Coolify deployment outline.
- Required secrets and env variable mapping.
- Backup/restore plan.
- Rollback plan.
- Open questions and blocked items.
- Final recommendation.

## Acceptance Criteria

- The audit identifies every app-owned Supabase table and migration.
- The audit explicitly states whether Storage, Realtime, and Edge Functions are
  currently required by Traveler.
- The audit maps each public or shared-trip access path to the security boundary
  that protects it.
- The audit includes a no-data-loss migration sequence.
- The audit includes a rollback path to managed Supabase.
- The audit does not change app behavior, migrations, secrets, or deployment
  configuration.
- The audit records official Supabase documentation links used for current
  self-hosting assumptions.

## Review Checklist

- [ ] No secret values are copied into documentation.
- [ ] No production URLs or keys are exposed.
- [ ] RLS verification is included as a required migration gate.
- [ ] Auth callback and SMTP requirements are documented.
- [ ] Backup restore is tested or clearly marked as untested.
- [ ] The final recommendation separates cost, reliability, maintenance, and
      security tradeoffs.

## Quality Gate

Documentation-only task:

- Run `pnpm run typecheck` if code references or generated types are changed.
- Run `pnpm run lint` if markdown linting or docs tooling exists.
- Full app build is not required unless app code or deployment configuration is
  changed.

