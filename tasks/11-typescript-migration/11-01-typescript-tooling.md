# 11-01 — TypeScript Tooling ✅ DONE

Read only:

- `package.json`
- `vite.config.js`
- `jsconfig.json`
- `eslint.config.*` if present
- `src/main.jsx`
- `src/App.jsx`

Goal: add TypeScript tooling without converting application files yet.

Requirements:

1. Add `typescript` as a dev dependency.
2. Add `tsconfig.json` with migration-safe settings:
   - `allowJs: true`
   - `checkJs: false`
   - `jsx: react-jsx`
   - path alias support for `@/*`
   - no emit
3. Keep `jsconfig.json` only if still useful; otherwise replace it cleanly with `tsconfig.json`.
4. Add `pnpm run typecheck`.
5. Configure ESLint for TypeScript files.
6. Add an automatic lint guard for zero `any`: `@typescript-eslint/no-explicit-any` must be `error`.
7. Do not rename app files in this task.
8. Do not enable broad strict blocking rules yet.
9. Confirm Vite build still works.

Manual test flow to report:

- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
