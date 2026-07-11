# 15-01 — Auth Product And Security Specification

**Estimate:** 1-3 hours

## Goal

Write the canonical product and security specification for auth, ownership,
admin access, and route protection before implementation starts.

## Scope

- User, public visitor, and admin roles
- Permission matrix
- Route inventory and target route map
- Existing route migration strategy
- Current database/RLS incompatibility inventory
- Existing trip owner assignment strategy
- Admin threat model
- Public share boundary assumptions for Phase 16

## Acceptance Criteria

- A document under `docs/architecture/` defines the auth and ownership model.
- Permissions matrix covers normal user, public visitor, and admin.
- Route inventory lists current routes and target routes.
- Admin threat model states that hidden UI is not security.
- Existing trips have a planned owner assignment path.
- The spec explicitly calls out current `SELECT using (true)` RLS as a blocker
  before private trips.

## Review Checklist

- [ ] No implementation code is changed.
- [ ] No security decision relies only on frontend state.
- [ ] Admin backup access is separated from normal trip editing.
- [ ] Slug vs id routing decision is documented.
- [ ] Phase 16 sharing assumptions do not require public trip table reads.
