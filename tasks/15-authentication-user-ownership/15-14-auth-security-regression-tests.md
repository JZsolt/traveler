# 15-14 — Auth Security And Regression Tests

**Estimate:** 2-3 hours

## Goal

Verify auth, ownership, route protection, and admin boundaries.

## Scope

- Session restore
- Protected redirect
- Logout cache clear
- Two-user trip isolation
- Owner spoofing rejection
- Normal user blocked from admin route
- Admin password success/failure
- Clean install quality gate if the phase changed dependencies

## Acceptance Criteria

- Automated or documented verification covers anon, User A, User B, and admin.
- Critical RLS cases are tested with real Supabase policies or documented SQL
  checks.
- Full project quality gate passes.
- Phase 15 known incompatibilities are closed or carried as explicit follow-up.

## Review Checklist

- [ ] Tests do not depend on production secrets.
- [ ] Owner spoofing is tested server/database side.
- [ ] Public sharing is still out of scope.
- [ ] No auth regression is hidden by mocked-only tests.
