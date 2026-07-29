# 15 — Authentication And User Ownership

Status: done.

## Goal

Introduce Supabase authentication, user-owned trips, protected app routes, and a
server-verified hidden admin backup area.

## Critical Principles

- Authentication is product behavior and security, not just UI gating.
- RLS and server-side checks are the primary security boundary.
- Client-side route guards are UX only.
- Normal users can manage only their own trips.
- Public visitors can only use explicit public routes.
- Admin backup access is separate from normal trip ownership.
- Admin must not automatically get an "edit any trip" UI path.

## Final State

- Routes: `/app/trips`, `/app/trips/new`, `/app/trips/:slug`,
  `/app/trips/:slug/edit`, `/app/settings`, `/app/internal/backup`.
  Legacy `/trip/:slug` and `/create-trip` redirect to new paths.
- `TripsContext` loads trips scoped to `auth.uid()` via RLS.
- `trips` table has `owner_id uuid NOT NULL` referencing `auth.users(id)`.
- RLS: 4 owner-scoped policies (select, insert, update, delete) using
  `auth.uid() = owner_id`. Service-role bypasses RLS for backup/import.
- Admin session: React state only (no sessionStorage). Server validates
  JWT + `ADMIN_USER_ID` + `ADMIN_PASSWORD` on every admin operation.
- Trip CRUD, AI, and editor operations are available to all authenticated
  users without admin unlock.
- Auth forms use `react-hook-form` with `@hookform/resolvers/zod`.
- Axios API client with auth token interceptor (`src/lib/apiClient.ts`).
- TanStack Query provider installed; cache cleared on logout.

## Subtasks

1. `15-01-auth-product-security-spec.md` ✅
2. `15-02-supabase-auth-configuration.md` ✅
3. `15-03-profiles-database-migration.md` ✅
4. `15-04-auth-schemas-and-types.md` ✅
5. `15-05-auth-provider-session-lifecycle.md` ✅
6. `15-06-login-registration-recovery-ui.md` ✅
7. `15-06a-client-library-dependencies.md` ✅
8. `15-06b-auth-forms-react-hook-form.md` ✅
9. `15-06c-axios-api-client-foundation.md` ✅
10. `15-06d-tanstack-query-provider.md` ✅
11. `15-07-protected-application-routes.md` ✅
12. `15-08-trip-ownership-migration.md` ✅
13. `15-09-trip-rls-policies.md` ✅
14. `15-10-trips-context-user-scoping.md` ✅
15. `15-11-my-trips-dashboard.md` ✅
16. `15-12-existing-admin-mode-separation.md` ✅
17. `15-13-hidden-admin-access.md` ✅
18. `15-14-auth-security-regression-tests.md` ✅

## Prod Rollout Checklist

Supabase migration order (must run manually in SQL Editor):

1. `002_create_profiles.sql` — profiles table + auto-create trigger
2. `003_trip_ownership.sql` — owner_id column + composite unique index
3. Backfill: `UPDATE public.trips SET owner_id = '<admin-user-uuid>' WHERE owner_id IS NULL;`
4. `004_trip_rls_owner_scoped.sql` — NOT NULL constraint + owner-scoped RLS

If backfill is incomplete, migration 004 aborts with a guard exception.

## Non-goals

- No Google login in Phase 15.
- No teams, collaboration, comments, or viewer/editor invites.
- No public trip search.
- No admin user-management UI.
- No broad visual redesign beyond the auth screens and app shell required by
  the task.
