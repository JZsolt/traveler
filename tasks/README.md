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
12. ~~12-runtime-validation.md~~ ✅ (10 subtask)
13. ~~13-clean-install-quality-gate.md~~ ✅ (6 subtask)
14. 14-build-log-cleanup.md (1 subtask — next phase)
15. 11-design-system-foundation.md (12 subtask — after Phase 14; legacy filename)

## Workflow

For every task:

1. Read `PROJECT_RULES.md`.
2. Read only the task file you are currently implementing.
3. Implement only the requested TASK.
4. Do not continue to the next TASK automatically.
5. Run `pnpm run typecheck`.
6. Run `pnpm run lint`.
7. Run `pnpm run test:run`.
8. Run `pnpm run build`.
9. Fix errors.
10. Summarize changed files.
11. **Mark the task as ✅ DONE in the .md file header!**
12. Stop and wait for approval before continuing.

The goal is to keep every implementation small, reviewable, and easy to debug.

## Standing Architecture Rules

Phase 10 defines project-wide architecture rules that apply to all future implementation and review work:

- `docs/architecture/ARCHITECTURE.md` is the canonical architecture reference.
- `tasks/PROJECT_RULES.md` contains the mandatory short checklist every task must follow.
- Reviews must check touched files for page thickness, hook/component extraction, 2+ duplication, hard-coded constants, file size, and token/theme usage.
- These rules remain active after phase 10 is complete.

## TypeScript Rules (Phase 11 — complete)

- `strict: true` in `tsconfig.json`. All app code is TypeScript.
- Shared types live in `src/types/`. No inline `type` or `interface` in component, hook, page, lib, or API files.
- No `any`: no explicit `any`, no `as any`, no `Record<string, any>`, no `any[]`.
- Use `unknown` plus narrowing for external data (Supabase, JSON, AI responses).
- `Trip`, `Day`, and `ScheduleItem` defined exactly once in `src/types/trip.ts`; no duplicate aliases.
- `pnpm run typecheck` must pass before every commit.

## Runtime Validation Rules (Phase 12 — complete)

- Zod is the single source of truth for runtime data shapes.
- External data starts as `unknown` and is parsed at the boundary.
- Schemas live under `src/schemas/`; public inferred types remain available through `src/types/`.
- Raw AI, Supabase, storage, URL, import, backup, or external API data must not reach domain code.

## Quality Gate Rules (Phase 13 — complete)

- Clean install (`pnpm install --frozen-lockfile`) must succeed before major phases.
- `pnpm run test:run` must pass — schema and normalizer tests guard runtime boundaries.
- New schemas or normalizer changes should include tests in `src/schemas/__tests__/` or `src/lib/__tests__/`.
- `.passthrough()` in Zod schemas must have a code comment explaining why extra keys are allowed.
- Design-system foundation may start only after Phase 14 build-log cleanup is complete.

## Build Log Rules

- Production build warnings must be reviewed and either fixed or documented.
- Do not silence chunk-size warnings by increasing the warning limit unless a task explicitly justifies it.
- Prefer route-level or feature-level lazy loading for large chunks.
- Keep `pnpm run build` clean before starting design-system migration.
