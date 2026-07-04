# 10 — Code Architecture Foundation ✅ DONE

This phase prepares the codebase for the design-system migration by reducing large files, separating logic from UI, and documenting code organization rules.

Important:

- Do not redesign UI in this phase.
- Do not add new product features in this phase.
- Do not change trip data shape.
- Implement exactly one subtask at a time.
- Read only the files listed in the current task.
- Preserve existing behavior.
- Run `pnpm run build` after every task.
- Stop after each task and summarize changed files.

Core rules:

- Pages compose views; pages should not own complex business logic.
- Custom hooks own stateful workflow logic.
- Shared UI belongs in components.
- Anything used in 2+ places should become a shared component/hook/helper.
- Target file size: about 200 lines.
- Hard maximum file size: about 250 lines unless the task documents a reason.
- Constants, route paths, endpoint paths, storage keys, model ids, section keys, and reusable messages should live outside JSX files.
- Theme tokens/CSS variables should be used instead of hard-coded colors/styles where practical.
- Avoid inline `style` unless required for browser/platform features.
- Type/interface definitions should not be embedded into component files when TypeScript is introduced later; keep that rule documented now.

## Subtasks

1. `10-01-code-architecture-rules.md`
2. `10-02-large-file-audit.md`
3. `10-03-constants-inventory.md`
4. `10-04-shared-editor-patterns-audit.md`
5. `10-05-extract-trip-page-hooks.md`
6. `10-06-extract-day-section-hooks.md`
7. `10-07-extract-schedule-item-hooks.md`
8. `10-08-extract-shared-editor-components.md`
9. `10-09-centralize-constants-and-copy.md`
10. `10-10-theme-style-audit.md`
11. `10-11-file-size-reduction-pass.md`
12. `10-12-architecture-final-review.md`

## Workflow

Open and implement exactly one task file from `tasks/10-code-architecture-foundation/`, then stop.

Do not continue to the next task automatically.

## Non-goals

- No visual redesign.
- No design-system primitive creation; that belongs to phase 11.
- No admin gate work; that belongs to phase 09.
- No new AI behavior.
- No schema migration.
