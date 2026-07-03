# 11-08 — Home Page Shell Migration

Read only:

- `docs/design/VISUAL_LANGUAGE.md`
- `docs/product/SCREEN_LIBRARY.md`
- `src/pages/HomePage.jsx`
- `src/components/ui/`
- directly imported Home page components

Goal: migrate only the Home page shell to the new primitives.

Requirements:

1. Use `Page` and `PageHeader` where appropriate.
2. Use `Section` and `Row` where they reduce one-off layout.
3. Preserve all existing Home behavior.
4. Do not change Supabase data loading.
5. Do not move admin controls in this task; phase 09 owns admin placement.
6. Keep mobile layout stable.
7. Do not redesign trip cards unless the change is necessary for the shell.

Manual test flow to report:

- Home loading state still works.
- Trip list still renders.
- Existing actions still work.
- Mobile width has no horizontal overflow.
- Run `pnpm run build`.

Do not write automated tests.
