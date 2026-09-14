# 19-01 — Supabase Self-Host Feasibility Audit ✅ DONE

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

## Result

Audit complete: `docs/architecture/SUPABASE_SELF_HOST_AUDIT.md` (2026-09-07).

Key findings:

- Storage, Realtime and Edge Functions are **not** used by Traveler, so the
  self-host stack can drop them plus the analytics/vector layer.
- The trimmed stack needs roughly 2-3 GB RAM; the target host has 15.5 GiB.
  Capacity is not the constraint, operations are.
- The existing GitHub backup covers `trip_data` only. It does not contain
  `auth.users`, profiles, shares, recipients or invite events, and must not be
  treated as a migration safety net.
- `SHARE_TOKEN_ENCRYPTION_KEY` must be carried over unchanged or existing share
  token ciphertexts become undecryptable.
- Migration invalidates every session, because the JWT secret changes.
- GoTrue needs its own SMTP configuration; `RESEND_API_KEY` covers only the
  app's invite emails, not signup confirmation and password reset.
- `on_auth_user_created` is a trigger on `auth.users`, which constrains restore
  ordering.

Recommendation: run steps 1-8 of the migration sequence (all risk-free, on a
copy), run `18-13` against the self-host stack rather than twice, and add a
keepalive to the managed project meanwhile.

## Quality Gate

Documentation-only task:

- Run `pnpm run typecheck` if code references or generated types are changed.
- Run `pnpm run lint` if markdown linting or docs tooling exists.
- Full app build is not required unless app code or deployment configuration is
  changed.

