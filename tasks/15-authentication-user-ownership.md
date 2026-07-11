# 15 — Authentication And User Ownership

Status: planned.

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

## Known Current Incompatibilities

- Current routes are `/`, `/create-trip`, `/trip/:slug`, `/trip/:slug/edit`;
  target routes are `/app/trips`, `/app/trips/new`, `/app/trips/:tripId`,
  `/app/trips/:tripId/edit`.
- Current `TripsContext` loads all trips before auth and relies on the current
  public-read RLS policy.
- Current `trips` table has `owner text`; target model needs `owner_id uuid`
  referencing `auth.users(id)`.
- Current RLS has `SELECT using (true)`, which conflicts with private user
  trips.
- Current admin session is a browser `sessionStorage` flag plus password
  endpoint; target admin must be tied to an authenticated Supabase user id and
  server-checked challenge/session.
- Current backup/import endpoints must remain admin-only, but normal create,
  edit, delete, AI, export, and share must move out of admin lock.
- Current slug-based lookup must not leak another user's trip after RLS is
  introduced; route/id strategy must be explicitly decided before migration.

## Subtasks

1. `15-01-auth-product-security-spec.md`
2. `15-02-supabase-auth-configuration.md`
3. `15-03-profiles-database-migration.md`
4. `15-04-auth-schemas-and-types.md`
5. `15-05-auth-provider-session-lifecycle.md`
6. `15-06-login-registration-recovery-ui.md`
7. `15-07-protected-application-routes.md`
8. `15-08-trip-ownership-migration.md`
9. `15-09-trip-rls-policies.md`
10. `15-10-trips-context-user-scoping.md`
11. `15-11-my-trips-dashboard.md`
12. `15-12-existing-admin-mode-separation.md`
13. `15-13-hidden-admin-access.md`
14. `15-14-auth-security-regression-tests.md`

## Workflow

Implement exactly one task from `tasks/15-authentication-user-ownership/`.

Do not continue automatically.

Run:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Non-goals

- No Google login in Phase 15.
- No teams, collaboration, comments, or viewer/editor invites.
- No public trip search.
- No admin user-management UI.
- No broad visual redesign beyond the auth screens and app shell required by
  the task.
