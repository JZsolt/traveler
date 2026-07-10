# 12-05 — Supabase Boundary Validation ✅ DONE

**Estimate:** 2 hours

## Goal

Validate every Supabase read before storing data in application state or using
it in server-side workflows.

## Scope

- `src/context/TripsContext.tsx`
- `src/lib/supabase.ts`
- Server-side Supabase reads under `api/`
- `src/schemas/trip.ts`

## Acceptance Criteria

- Supabase `trip_data` starts as `unknown`.
- Every row and `trip_data` value is parsed before entering `TripsContext`.
- One invalid row cannot crash or poison all valid trips.
- Invalid-row behavior is explicit and observable without logging trip content.
- Server-side backup reads validate row envelopes before serialization.
- Supabase writes accept only schema-valid domain values.

## Review Checklist

- [ ] No raw `trip_data` reaches components or hooks.
- [ ] Loading/error/partial-data behavior is defined.
- [ ] Service-role and anon-client boundaries remain separate.
- [ ] Refetch Promise and race-safety behavior is preserved.
- [ ] RLS and database behavior are unchanged.

