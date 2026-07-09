# 12-02 — Shared Domain Schemas

**Estimate:** 2–3 hours

## Goal

Define the canonical Zod schemas for Trip data and derive domain types without
duplicating the existing model.

## Scope

- `src/schemas/trip.ts`
- `src/types/trip.ts`
- Direct type consumers only when required for compatibility

Cover `Trip`, `Day`, `ScheduleItem`, and all nested persisted objects. Preserve
known legacy variants such as optional fields and urgent-booking link formats.

## Acceptance Criteria

- Every persisted Trip field has a schema.
- Unknown keys are handled intentionally (`strip`, `passthrough`, or strict)
  and the choice is documented.
- `Trip`, `Day`, and `ScheduleItem` types are inferred from schemas and remain
  available from `src/types/trip.ts`.
- Valid current backups and the trip template parse successfully.
- Invalid nested schedule/list values fail with path-aware errors.
- No runtime boundary is switched to the schemas yet.

## Review Checklist

- [ ] No duplicate manual domain interface remains.
- [ ] Optional/default behavior matches current data.
- [ ] Legacy backup shapes are represented intentionally.
- [ ] Schema composition avoids one oversized file where practical.
- [ ] Typecheck, lint, build, and trip validation pass.

