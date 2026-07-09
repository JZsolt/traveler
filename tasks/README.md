# Traveler Development Roadmap

This folder contains the implementation roadmap for the Traveler project.

## Development Order

Always complete the phases in this order:

1. ~~01-crud.md~~ ✅
2. ~~02-safe-rendering.md~~ ✅
3. ~~03-json-import-export.md~~ ✅
4. ~~04-gemini-backend.md~~ ✅
5. ~~05-ai-chat-ui.md~~ ✅
6. ~~06-polish.md~~ ✅
7. ~~07-git-hub-backup.md~~ ✅
8. ~~08-inline-trip-editor.md~~ ✅ (24 subtask)
9. ~~09-admin-settings-lock.md~~ ✅ (6 subtask + cleanup)
10. ~~10-code-architecture-foundation.md~~ ✅ (12 subtask)
11. ~~11-typescript-migration.md~~ ✅ (15 subtask)
12. 11-design-system-foundation.md (12 subtask — next phase)

## Workflow

For every task:

1. Read `PROJECT_RULES.md`.
2. Read only the task file you are currently implementing.
3. Implement only the requested TASK.
4. Do not continue to the next TASK automatically.
5. Run `pnpm run build`.
6. Fix build errors.
7. Summarize changed files.
8. **Mark the task as ✅ DONE in the .md file header!**
9. Stop and wait for approval before continuing.

The goal is to keep every implementation small, reviewable, and easy to debug.

## Standing Architecture Rules

Phase 10 defines project-wide architecture rules that apply to all future implementation and review work:

- `docs/architecture/ARCHITECTURE.md` is the canonical architecture reference.
- `tasks/PROJECT_RULES.md` contains the mandatory short checklist every task must follow.
- Reviews must check touched files for page thickness, hook/component extraction, 2+ duplication, hard-coded constants, file size, and token/theme usage.
- These rules remain active after phase 10 is complete.

## TypeScript Migration Rule

Phase 11 must be completed before design-system work starts.

- Use `tasks/11-typescript-migration.md` for the active next phase.
- Keep shared TypeScript types in `src/types/`.
- Do not place any `type` or `interface` declarations inside component, hook, page, lib, or API files.
- Never use `any`: no explicit `any`, no `as any`, no `Record<string, any>`, no `any[]`.
- Use `unknown` plus narrowing for external data.
- `Trip`, `Day`, and `ScheduleItem` must be defined exactly once in `src/types/trip.ts`; do not create duplicate `TripData`, `TripDay`, or `Activity` types.
- Every TypeScript migration task must run `pnpm run typecheck` once the script exists, plus `pnpm run build`.
