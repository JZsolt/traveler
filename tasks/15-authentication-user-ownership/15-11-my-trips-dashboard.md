# 15-11 — My Trips Dashboard

**Estimate:** 2-3 hours

## Goal

Create the authenticated user's trip dashboard.

## Scope

- `/app/trips`
- Greeting
- Create new trip action
- Recent trips
- Private/shared state badge
- Trip actions menu shell
- Empty state

## Acceptance Criteria

- Dashboard displays only the current user's trips.
- Empty state offers a create action.
- Shared/private badge is ready for Phase 16 state.
- No admin backup controls appear here.
- Mobile layout has no horizontal overflow.

## Review Checklist

- [ ] Dashboard does not query all trips and filter client-side as security.
- [ ] Actions respect ownership.
- [ ] Uses design-system primitives where practical.
- [ ] No sharing implementation is added early.
