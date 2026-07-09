# 12-10 — Runtime Validation Final Review

**Estimate:** 2 hours

## Goal

Prove that all external data boundaries validate before domain use and close
the phase only when no unsafe path remains.

## Scope

- `src/`
- `api/`
- `src/schemas/`
- `src/types/`
- Runtime-validation documentation and roadmap

## Acceptance Criteria

- Boundary inventory covers AI, Supabase, browser storage, URL params, imported
  JSON, backup files, and external API JSON.
- Every boundary maps to a named Zod schema and owner.
- Schema/type duplication audit is clean.
- Invalid-input behavior is documented for each boundary.
- No unsafe cast or raw external payload reaches domain logic.
- Phase 12 and roadmap are marked done only after all checks pass.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run validate:trips
pnpm run validate:trips:strict
```

## Review Checklist

- [ ] All Phase 12 subtasks are marked done.
- [ ] Schema files remain focused and within size limits.
- [ ] Valid legacy backups and current Supabase trips remain compatible.
- [ ] User-visible validation errors are safe and Hungarian.
- [ ] No secrets or raw personal data appear in logs.
- [ ] Design-system phase is unblocked only after this review.

