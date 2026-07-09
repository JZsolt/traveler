# 11-11 — Page Components To TSX ✅ DONE

Read only:

- `src/App.jsx`
- `src/main.jsx`
- `src/pages/`
- `src/components/Header.jsx`
- `src/components/DbError.jsx`
- `src/components/BackupButton.jsx`
- `src/components/ImportBackup.jsx`
- `src/context/`
- `src/hooks/`
- `src/types/`

Goal: convert app entry, routing, and page components to TSX.

Requirements:

1. Convert `src/main.jsx` and `src/App.jsx`.
2. Convert all page components in `src/pages/`.
3. Convert page-level support components listed above.
4. Type route params and navigation state.
5. Type form state and generated trip preview state.
6. Do not define inline route/page/form types; put them in `src/types/`.
7. Preserve hook order and redirects.
8. Preserve admin gate behavior.
9. Do not migrate design/layout primitives here; this is typing only.

Manual test flow to report:

- Home renders.
- Settings admin unlock works.
- Create trip page redirects when locked.
- Trip page renders an existing trip.
- Import/export backup controls render in Settings.
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
