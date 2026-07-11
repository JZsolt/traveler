# 15-13 — Hidden Admin Access

**Estimate:** 2-3 hours

## Goal

Create a discreet but server-verified admin entry path for backup tools.

## Scope

- Admin user identified by `ADMIN_USER_ID`.
- Hidden gesture on profile footer/version for that user only.
- Admin challenge dialog.
- Server-checked admin password.
- Short-lived admin session or token.
- Protected `/app/internal/backup` route.

## Acceptance Criteria

- Gesture does nothing for non-admin users.
- Admin password is checked server-side.
- Direct URL access to admin route is blocked without active admin session.
- Backup endpoint independently verifies admin authorization.
- Admin session expires or can be cleared.

## Review Checklist

- [ ] `ADMIN_USER_ID` is server-controlled.
- [ ] No admin secret is exposed via `VITE_`.
- [ ] UI hiding is not treated as security.
- [ ] Admin session cannot be forged by editing browser storage alone.
