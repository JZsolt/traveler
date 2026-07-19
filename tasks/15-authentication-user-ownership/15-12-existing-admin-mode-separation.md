# 15-12 — Existing Admin Mode Separation ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Separate normal user trip CRUD from hidden admin backup/import capability.

## Scope

- Audit current `AdminContext` usage.
- Remove admin lock from normal own-trip create/edit/delete/AI flows.
- Keep backup/import admin-only.
- Update backup/import endpoint auth requirements.
- Prevent old browser admin flag from granting normal trip permissions.

## Acceptance Criteria

- Normal user can manage own trips without admin password.
- Normal user cannot access backup/import.
- Admin browser flag is not a substitute for ownership.
- Backup/import remains gated by admin password (server challenge upgrade to JWT + ADMIN_USER_ID is 15-13).

## Review Checklist

- [ ] No "edit any trip" admin UI is added.
- [ ] Admin endpoints do not trust client flags.
- [ ] Normal mutation paths still rely on RLS/owner checks.
- [ ] Settings/profile navigation remains understandable.
