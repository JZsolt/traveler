# 11-14 — Tighten Typecheck

Read only:

- `tsconfig.json`
- `package.json`
- all `src/**/*.ts`
- all `src/**/*.tsx`
- remaining `src/**/*.js`
- remaining `src/**/*.jsx`
- `api/`
- `docs/architecture/TYPESCRIPT.md`

Goal: tighten TypeScript after most app code has been migrated.

Requirements:

1. Audit remaining `.js` and `.jsx` files.
2. Convert remaining app files if practical.
3. Enable stricter compiler options incrementally:
   - `strict: true` if feasible
   - `noImplicitAny: true`
   - `noUncheckedIndexedAccess` only if not too noisy
4. If a strict option is deferred, document exact blockers in `TYPESCRIPT.md`.
5. Remove obsolete migration-only casts and temporary types.
6. Keep `allowJs` only if needed for scripts/API; document why.
7. Do not accept any `any`, even with comments.
8. Remove duplicate local definitions of `Trip`, `Day`, `ScheduleItem`, `Activity`, or equivalent aliases.

Manual test flow to report:

- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run validate:trips`

Do not write automated tests.
