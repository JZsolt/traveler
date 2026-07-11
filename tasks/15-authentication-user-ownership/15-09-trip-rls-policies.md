# 15-09 — Trip RLS Policies

**Estimate:** 2-3 hours

## Goal

Make trip privacy a database-level guarantee.

## Scope

- Remove public trip table read policy.
- Add own-trip SELECT policy.
- Add own-trip INSERT policy.
- Add own-trip UPDATE policy.
- Add own-trip DELETE policy.
- Prevent `owner_id` reassignment.
- Add SQL/RLS verification notes or tests.

## Acceptance Criteria

- User A cannot list User B trips.
- User A cannot fetch User B trip by known id or slug.
- User A cannot update/delete User B trip.
- User A cannot insert/update a trip owned by User B.
- Anonymous users cannot read `trips` directly.

## Review Checklist

- [ ] `SELECT using (true)` is gone before private trips ship.
- [ ] Policies use `auth.uid()` or equivalent trusted Supabase identity.
- [ ] Public sharing is not implemented by opening the `trips` table.
- [ ] Tests/verification cover anon, User A, and User B.
