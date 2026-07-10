# 13-06 — Quality Gate Documentation ✅ DONE

**Estimate:** 1 hour

## Goal

Document the clean-install and runtime-validation test gate so future review and
implementation tasks consistently enforce it.

## Scope

- `tasks/PROJECT_RULES.md`
- `tasks/README.md`
- `docs/architecture/ARCHITECTURE.md`
- Root README if it already describes development checks

Do not change source code in this task unless needed to align scripts.

## Acceptance Criteria

- Project rules mention clean install validation before major phases.
- Runtime validation review checklist includes schema/normalizer tests.
- Development roadmap marks Phase 13 complete only after all subtasks are done.
- Design-system phase is documented as blocked until Phase 13 is complete.
- Required commands include test execution once the test runner exists.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Docs match actual package scripts.
- [ ] No stale reference says design-system is unblocked before Phase 13.
- [ ] Rules remain short enough for implementers to follow.
- [ ] Runtime validation rules still prioritize Zod boundary parsing.
- [ ] No task is marked done unless actually completed.
