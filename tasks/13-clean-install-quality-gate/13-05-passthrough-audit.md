# 13-05 — Passthrough Audit ✅ DONE

**Estimate:** 1-2 hours

## Goal

Make every `.passthrough()` intentional, documented, and limited to data shapes
that genuinely need unknown extra keys.

## Scope

- `src/schemas/trip.ts`
- `src/schemas/ai.ts`
- Related docs or task notes

Do not change unrelated validation behavior.

## Acceptance Criteria

- Every `.passthrough()` occurrence is reviewed.
- Kept `.passthrough()` usages have a short code comment explaining why unknown
  keys are allowed.
- Unneeded `.passthrough()` usages are removed or replaced with stricter schemas.
- Existing valid trips and AI flows still pass tests.
- Any intentionally preserved unknown data path is documented.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] `GuideSchema` passthrough is justified or tightened.
- [ ] `AccommodationSchema` passthrough is justified or tightened.
- [ ] `ExpandDayResponseSchema` passthrough is justified or tightened.
- [ ] `ScheduleItemResponseSchema` passthrough is justified or tightened.
- [ ] Tests cover any behavior that changed.
