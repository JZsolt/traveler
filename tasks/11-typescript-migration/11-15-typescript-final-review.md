# 11-15 — TypeScript Final Review

Read only:

- `tasks/11-typescript-migration.md`
- `tasks/11-typescript-migration/`
- `docs/architecture/TYPESCRIPT.md`
- `docs/architecture/ARCHITECTURE.md`
- `package.json`
- `tsconfig.json`
- `src/`
- `api/`

Goal: verify the TypeScript migration is complete enough to start design-system work.

Requirements:

1. Confirm every TypeScript migration subtask is marked done before marking this task done.
2. Check for remaining `.jsx` files and document whether each is acceptable or must be migrated.
3. Check for remaining `.js` files in app/runtime code and document whether each is acceptable.
4. Search for `any`, `as any`, `Record<string, any>`, `any[]`, `@ts-ignore`, `@ts-expect-error`, and broad casts.
5. Confirm shared types live in `src/types/`.
6. Confirm there are no inline `type` or `interface` declarations outside `src/types/`.
7. Confirm `Trip`, `Day`, and `ScheduleItem` are defined only once in `src/types/trip.ts`.
8. Confirm there is no duplicate `Activity`, `TripData`, `TripDay`, or equivalent domain type.
9. Confirm Phase 10 architecture rules still hold:
   - file sizes
   - hook/component separation
   - constants outside JSX
   - theme/token readiness for design phase
10. Update `tasks/11-typescript-migration.md` to `✅ DONE` only when the phase is complete.
11. Update `tasks/README.md` so design-system work is the next phase.

Manual test flow to report:

- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run validate:trips`
- `pnpm run lint` and report existing baseline issues separately if any remain.

Do not write automated tests.
