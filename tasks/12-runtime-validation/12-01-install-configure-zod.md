# 12-01 — Install And Configure Zod

**Estimate:** 1 hour

## Goal

Add Zod and establish schema conventions without changing runtime behavior.

## Scope

- `package.json`
- `pnpm-lock.yaml`
- `src/schemas/`
- `docs/architecture/`

Create the `src/schemas/` entry structure and document naming, parsing,
error-formatting, strictness, defaults, and type-inference conventions.

## Acceptance Criteria

- `zod` is a production dependency.
- `src/schemas/` exists with a small public entry point.
- Schema names use `PascalCaseSchema`; parsed types remain exported through
  `src/types/`.
- A shared helper converts `ZodError` issues to safe Hungarian UI/API errors.
- No existing boundary behavior changes.
- Typecheck, lint, and build pass.

## Review Checklist

- [ ] Zod is not duplicated across dependencies.
- [ ] No schema imports React, Supabase clients, or UI code.
- [ ] No `any`, broad cast, or inline type was introduced.
- [ ] Error formatting does not leak secrets or raw payloads.
- [ ] Files remain below architecture size limits.

