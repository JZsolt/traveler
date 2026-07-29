# 15-13 — Hidden Admin Access ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Create a discreet but server-verified admin entry path for backup tools.

## Scope

- Admin user identified by `ADMIN_USER_ID`.
- Hidden gesture on profile footer/version; admin identity is verified server-side.
- Admin challenge dialog.
- Server-checked admin password.
- Short-lived admin session or token.
- Protected `/app/internal/backup` route.

## Acceptance Criteria

- Non-admin users who discover the gesture reach the admin challenge but server rejects their unlock attempt (ADMIN_USER_ID is server-only, not exposed to client).
- Admin password is checked server-side.
- Direct URL access to admin route is blocked without active admin session.
- Backup endpoint independently verifies admin authorization.
- Admin session expires or can be cleared.

## Review Checklist

- [ ] `ADMIN_USER_ID` is server-controlled.
- [ ] No admin secret is exposed via `VITE_`.
- [ ] UI hiding is not treated as security.
- [ ] Admin session cannot be forged by editing browser storage alone.
