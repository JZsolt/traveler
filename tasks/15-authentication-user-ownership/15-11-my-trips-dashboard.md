# 15-11 — My Trips Dashboard ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Create the authenticated user's trip dashboard.

## Scope

- `/app/trips`
- Greeting
- Create new trip action (always visible, not admin-only)
- Recent trips
- Empty state with create action
- Private/shared state badge — deferred to Phase 16 (sharing not implemented yet)
- Trip actions menu shell — deferred to 15-12 (admin separation)

## Acceptance Criteria

- Dashboard displays only the current user's trips.
- Empty state offers a create action.
- No sharing badge is implemented before Phase 16.
- No admin backup controls appear here.
- Mobile layout has no horizontal overflow.

## Notes

- Brand color hardcodes (`#e94560`, `#0f3460`, `#1a1a2e`, `bg-green-500`) remain in trip cards.
  These are used in 15+ files across the codebase — token migration is a separate design-system pass.

## Review Checklist

- [ ] Dashboard does not query all trips and filter client-side as security.
- [ ] Actions respect ownership.
- [ ] Uses design-system primitives where practical.
- [ ] No sharing implementation is added early.
