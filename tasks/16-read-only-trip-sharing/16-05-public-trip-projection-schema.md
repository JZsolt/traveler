# 16-05 — Public Trip Projection Schema

**Estimate:** 1-2 hours

## Goal

Define the exact public shape returned for shared trips.

## Scope

- Public trip schema under `src/schemas/`.
- Public response type under `src/types/` if needed.
- Projection helper.
- Explicit exclusion list.

## Acceptance Criteria

- Public response excludes `owner_id`, user email, admin state, backup metadata,
  internal IDs not needed by UI, and future private notes.
- Projection output validates with Zod.
- Shared page uses the public projection type, not full `TripRow`.

## Review Checklist

- [ ] No full trip database row is returned.
- [ ] Projection is stable and testable.
- [ ] Unknown/extra fields are intentionally handled.
- [ ] Future private fields have a documented exclusion rule.
