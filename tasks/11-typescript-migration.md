# 11 — TypeScript Migration ✅ DONE

This phase migrates Traveler from JavaScript/JSX to TypeScript/TSX before the design-system migration starts.

Important:

- Do not start the design-system migration until this phase is complete.
- Implement exactly one subtask at a time.
- Read only the files listed in the current task.
- Preserve runtime behavior and trip data shape.
- Keep Supabase, Vercel, PWA, and AI endpoints working.
- Use `allowJs` during the migration; do not force a big-bang rename.
- All explicit type aliases and interfaces live in `src/types/`.
- Pages compose views; stateful logic still belongs in hooks.
- Do not introduce new product features.
- Do not redesign UI.
- Run `pnpm run build` after every task.
- Run `pnpm run typecheck` once that script exists.
- Stop after each task and summarize changed files.

Core TypeScript rules:

- Shared domain types live in `src/types/`.
- No inline `type` or `interface` declarations in `.ts`/`.tsx` component, hook, lib, page, or API files.
- No `any` anywhere: no explicit `any`, no `as any`, no `Record<string, any>`, no `any[]`, no implicit-any workaround.
- Use `unknown` plus narrowing for external data.
- `Trip`, `Day`, and `ScheduleItem` are canonical and may only be defined once in `src/types/trip.ts`.
- Do not create duplicate aliases such as `TripData`, `TripDay`, `Activity`, or local copies of `Trip`/`Day`/`ScheduleItem`.
- Prefer `unknown` + narrowing for external JSON/API data.
- Use type-only imports where possible.
- Preserve existing path aliases.
- Keep file sizes under the Phase 10 limits while converting.
- Do not convert files by disabling errors with broad casts.
- API request bodies and responses must have explicit types.

## Subtasks

1. `11-01-typescript-tooling.md`
2. `11-02-type-inventory.md`
3. `11-03-domain-types.md`
4. `11-04-lib-helpers-to-ts.md`
5. `11-05-supabase-and-context-types.md`
6. `11-06-admin-and-trip-hooks-to-ts.md`
7. `11-07-day-and-schedule-hooks-to-ts.md`
8. `11-08-ui-primitives-to-tsx.md`
9. `11-09-editor-components-to-tsx.md`
10. `11-10-trip-components-to-tsx.md`
11. `11-11-page-components-to-tsx.md`
12. `11-12-api-endpoints-to-ts.md`
13. `11-13-scripts-and-data-boundaries.md`
14. `11-14-tighten-typecheck.md`
15. `11-15-typescript-final-review.md`

## Workflow

Open and implement exactly one task file from `tasks/11-typescript-migration/`, then stop.

Do not continue to the next task automatically.

## Non-goals

- No visual redesign; design-system work comes after this phase.
- No trip schema changes.
- No new editor features.
- No AI behavior changes.
- No admin/security behavior changes unless needed only for typing.
- No full strict-mode jump before the migration is complete.
