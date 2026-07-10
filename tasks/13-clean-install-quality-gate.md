# 13 — Clean Install & Runtime Validation Quality Gate ✅ DONE

This phase proves that Phase 12 works from a clean checkout and adds a small
test safety net before design-system work starts.

## Goal

Traveler must build from a clean install, and the runtime validation layer must
have focused tests for schemas and normalizers.

## Mandatory Rules

- Do not start design-system implementation in this phase.
- Keep changes limited to test tooling, schema tests, normalizer tests, and
  validation documentation.
- `zod` must remain a production dependency.
- Runtime schemas remain under `src/schemas/`.
- No `any`, no inline type/interface in app/API/lib/test implementation files.
- Tests must use real schemas and real normalizers, not duplicated fixtures with
  copied validation logic.
- Invalid data behavior must stay controlled and deterministic.

## Subtasks

1. `13-01-clean-install-build.md`
2. `13-02-test-framework.md`
3. `13-03-schema-tests.md`
4. `13-04-normalize-trip-tests.md`
5. `13-05-passthrough-audit.md`
6. `13-06-quality-gate-docs.md`

## Workflow

Implement exactly one task from `tasks/13-clean-install-quality-gate/`, mark
only that task done, run its checks, summarize changed files, and stop.

## Definition Of Done

- Clean install build is documented and passes.
- Unit test tooling exists and runs in CI-style mode.
- Schema and normalizer tests cover the highest-risk runtime boundaries.
- `.passthrough()` usage is intentionally documented or tightened.
- Project rules mention the clean-install quality gate.
- Design-system foundation may start only after task 13-06 is complete.
