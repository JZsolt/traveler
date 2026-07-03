# 10 — Design System Foundation

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

1. `10-01-design-token-audit.md`
2. `10-02-css-design-tokens.md`
3. `10-03-page-and-page-header-primitives.md`
4. `10-04-section-and-row-primitives.md`
5. `10-05-empty-loading-error-primitives.md`
6. `10-06-timeline-primitives.md`
7. `10-07-design-system-route.md`
8. `10-08-home-page-shell-migration.md`
9. `10-09-trip-overview-migration.md`
10. `10-10-day-timeline-visual-migration.md`
11. `10-11-create-trip-page-shell-migration.md`
12. `10-12-mobile-accessibility-polish.md`

## Workflow

Open and implement exactly one task file from `tasks/10-design-system-foundation/`, then stop.

Do not continue to the next task automatically.

## Non-goals

- No full visual rewrite.
- No new product features.
- No trip schema changes.
- No AI behavior changes.
- No admin/security changes; those belong to phase 09.
