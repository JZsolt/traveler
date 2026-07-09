# 12-04 — Normalize Trip Integration

**Estimate:** 2 hours

## Goal

Replace handwritten boundary assertions in `normalizeTrip` with the canonical
Trip schema while preserving safe defaults and legacy compatibility.

## Scope

- `src/lib/normalizeTrip.ts`
- `src/schemas/trip.ts`
- Focused normalization/error helpers

## Acceptance Criteria

- `normalizeTrip` accepts only `unknown`.
- Valid complete trips parse without data loss.
- Supported legacy trips are upgraded through explicit Zod preprocess/transform
  rules, not unchecked casts.
- Invalid root data returns the documented empty/default Trip fallback.
- Invalid nested items are handled by an explicit policy: reject, default, or
  filter with a surfaced diagnostic.
- No manual type predicate claims a broader type than it validates.

## Review Checklist

- [ ] Unknown keys and legacy fields are preserved or intentionally migrated.
- [ ] `url` and `urls[]` booking variants remain supported.
- [ ] Schedule nested arrays cannot reach domain code malformed.
- [ ] No duplicated defaults exist between schema and normalizer.
- [ ] Supabase loading still renders existing trips.

