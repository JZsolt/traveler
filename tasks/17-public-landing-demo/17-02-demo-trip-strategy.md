# 17-02 — Demo Trip Strategy

**Estimate:** 1-2 hours

## Goal

Choose and document a safe demo trip data strategy.

## Scope

- Static versioned demo data, or
- Dedicated `is_demo` record strategy
- Read-only use
- No normal private user trip as demo

## Acceptance Criteria

- Demo data source is documented.
- Demo route cannot expose private user data.
- Demo content is stable for public visitors.
- Implementation path is compatible with Zod schemas.

## Review Checklist

- [ ] Demo is not tied to a real private owner trip.
- [ ] Demo cannot be edited by public visitors.
- [ ] Demo strategy does not weaken RLS.
- [ ] Data update workflow is documented.
