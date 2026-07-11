# 15-07 — Protected Application Routes

**Estimate:** 2-3 hours

## Goal

Move app functionality behind authenticated routes.

## Scope

- `PublicOnlyRoute`
- `ProtectedRoute`
- Route map:
  - `/app`
  - `/app/trips`
  - `/app/trips/new`
  - `/app/trips/:tripId`
  - `/app/trips/:tripId/edit`
  - `/app/profile`
- Redirect after login to originally requested route
- Temporary compatibility redirects from old routes if needed

## Acceptance Criteria

- Anonymous user visiting `/app/*` is redirected to login.
- After login, user returns to the intended app route.
- Logged-in user visiting `/login` or `/register` is redirected to the app.
- Existing product routes have a documented compatibility path.

## Review Checklist

- [ ] Route guards are UX only; data security still relies on RLS/API checks.
- [ ] No route renders app data before auth loading resolves.
- [ ] Old slug routes cannot leak private trips.
- [ ] Public `/share/:token` is not protected.
