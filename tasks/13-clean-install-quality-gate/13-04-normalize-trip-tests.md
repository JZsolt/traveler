# 13-04 — Normalize Trip Tests ✅ DONE

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
- `validateTripJson` is lenient: normalizes all salvageable/defaultable inputs
  and always returns `TripSchema`-valid output. Only structurally unnormalizable
  data is rejected.

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
