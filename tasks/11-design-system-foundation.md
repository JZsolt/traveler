# 11 — Design System Foundation

Status: deferred until `12-runtime-validation.md` is complete.

Do not start these tasks while runtime validation tasks are still open. This is
the next design phase after runtime validation, even though the legacy file
name still uses `11-*`.

This phase turns the existing Traveler design documentation into a small, reusable UI foundation.

Important:

- Do not redesign the whole app in one pass.
- Implement exactly one subtask at a time.
- Read only the files listed in the current task.
- Prefer small primitives over page-specific styles.
- Preserve all existing business logic.
- Do not change trip data shape.
- Do not add new dependencies unless the task explicitly allows it.
- Run `pnpm run build` after every task.
- Stop after each task and summarize changed files.

Design source of truth:

- `docs/design/VISUAL_LANGUAGE.md`
- `docs/design/TYPOGRAPHY.md`
- `docs/design/ICON_SYSTEM.md`
- `docs/design/COMPONENT_SPEC.md`
- `docs/design/IMPLEMENTATION_PLAN.md`
- `docs/product/UX_RULES.md`

## Subtasks

1. `11-01-design-token-audit.md`
2. `11-02-css-design-tokens.md`
3. `11-03-page-and-page-header-primitives.md`
4. `11-04-section-and-row-primitives.md`
5. `11-05-empty-loading-error-primitives.md`
6. `11-06-timeline-primitives.md`
7. `11-07-design-system-route.md`
8. `11-08-home-page-shell-migration.md`
9. `11-09-trip-overview-migration.md`
10. `11-10-day-timeline-visual-migration.md`
11. `11-11-create-trip-page-shell-migration.md`
12. `11-12-mobile-accessibility-polish.md`

## Workflow

Open and implement exactly one task file from `tasks/11-design-system-foundation/`, then stop.

Do not continue to the next task automatically.

## Non-goals

- No full visual rewrite.
- No new product features.
- No trip schema changes.
- No AI behavior changes.
- No admin/security changes; those belong to phase 09.
