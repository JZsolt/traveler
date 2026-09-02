# 19 — Supabase Self-Host Audit And Migration Plan

Status: planned.

## Goal

Decide whether Traveler should stay on managed Supabase, move to Supabase Pro,
or migrate to a self-hosted Supabase stack, with a concrete migration and
rollback plan before any infrastructure change.

## Context

The current Supabase project is on the Free plan and can be paused after low
activity. This creates avoidable friction for a self-hosted Traveler deployment.

Traveler already depends on Supabase Auth, Postgres, RLS, service-role API
handlers, public share tokens, account-to-account sharing, and profile QR
features. A self-host migration must preserve these security boundaries.

## Critical Principles

- Do not change production data before backup and restore are tested.
- Do not weaken RLS or expose raw `trips.trip_data` to public or recipient
  users.
- Keep managed Supabase rollback possible until the self-host stack is proven.
- Treat auth callback URLs, SMTP, service role keys, and JWT secrets as
  production security configuration.
- Prefer an audit-first workflow over mixing infrastructure migration into
  feature phases.
- Keep Coolify/Docker deployment documented and reproducible.

## Subtasks

1. `19-01-supabase-self-host-feasibility-audit.md`

## Workflow

Implement exactly one task from `tasks/19-supabase-self-host-audit/`, run the
quality gate required by that task, mark only that task done, and stop.

## Non-goals

- No immediate production migration.
- No schema redesign.
- No auth provider replacement.
- No removal of managed Supabase support until rollback is no longer needed.
- No Phase 17 or Phase 18 feature changes.

