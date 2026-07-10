# 12-09 — Remove Unsafe Boundary Casts ✅ DONE

**Estimate:** 1–2 hours

## Goal

Remove migration-era assertions that bypass the new runtime schemas.

## Scope

- `src/`
- `api/`
- `src/schemas/`
- `src/types/`

Audit only boundary-related casts. Do not refactor unrelated UI typing.

## Acceptance Criteria

- No `as any`, double cast, or broad external-payload cast remains.
- Remaining `as` assertions are individually justified by language/library
  limitations and operate only on already validated values.
- Handwritten guards duplicated by Zod schemas are removed.
- Domain functions accept parsed types rather than `unknown`.
- External adapters return discriminated parse results or validated values.

## Review Checklist

- [ ] Search includes `as`, `satisfies`, non-null assertions, and JSON parsing.
- [ ] Removing guards does not remove required runtime validation.
- [ ] Schemas do not import inferred types that create circular ownership.
- [ ] `Trip`, `Day`, and `ScheduleItem` still have one canonical source.
- [ ] Typecheck, lint, and build pass.

