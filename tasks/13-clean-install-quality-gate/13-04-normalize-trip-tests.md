# 13-04 — Normalize Trip Tests

**Estimate:** 2-3 hours

## Goal

Lock down `normalizeTrip` and `validateTripJson` behavior at imported JSON and
Supabase read boundaries.

## Scope

- `src/lib/normalizeTrip.ts`
- `src/lib/validateTripJson.ts`
- Test files for normalizer behavior

Avoid large normalizer rewrites in this task.

## Acceptance Criteria

- `normalizeTrip` returns a valid default trip for non-object input.
- `normalizeTrip` preserves valid complete trips.
- Partial legacy-style trip data is normalized into a `TripSchema`-valid value.
- Invalid nested arrays are filtered instead of leaking raw invalid items.
- Final Zod recheck failure returns the documented safe fallback.
- `validateTripJson` rejects data that cannot be normalized into valid import
  data.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Tests exercise real `normalizeTrip` and `validateTripJson`.
- [ ] Test fixtures are small and readable.
- [ ] No broad casts or `any` are added to make tests pass.
- [ ] Failure behavior remains controlled and Hungarian where user-facing.
- [ ] No unrelated schema relaxation is introduced.
