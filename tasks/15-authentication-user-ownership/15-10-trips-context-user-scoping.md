# 15-10 — TripsContext User Scoping

**Estimate:** 2-3 hours

## Goal

Bind trip loading and cache lifecycle to the authenticated user.

## Scope

- Trips load only after auth resolves and user exists.
- Logout clears trips.
- User switch clears previous user data.
- Refetch respects current session.
- Loading, error, and empty states are distinct.

## Acceptance Criteria

- Anonymous state does not load private trips.
- Logout immediately clears the visible trip list.
- User A data is never visible during User B session restore.
- RLS remains the primary isolation mechanism; frontend filtering is not
  treated as security.

## Review Checklist

- [ ] No global pre-auth trip fetch remains.
- [ ] `TripsContext` does not own auth implementation.
- [ ] Normalization still validates Supabase trip payloads.
- [ ] Cache invalidation is explicit on logout/user change.
