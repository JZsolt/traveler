# 10-03 — Page And PageHeader Primitives

Read only:

- `docs/design/COMPONENT_SPEC.md`
- `docs/design/VISUAL_LANGUAGE.md`
- `src/components/ui/`
- `src/lib/utils.js`

Goal: add small layout primitives for consistent page shells.

Requirements:

1. Add `src/components/ui/Page.jsx`.
2. Add `src/components/ui/PageHeader.jsx`.
3. `Page` should handle:
   - mobile-safe top padding
   - page background
   - constrained content width option
   - `className`
   - `children`
4. `PageHeader` should handle:
   - title
   - optional subtitle
   - optional leading action
   - optional trailing action
5. Use existing `cn` helper if useful.
6. Do not migrate pages in this task.
7. Update `docs/design/COMPONENT_SPEC.md` statuses.

Manual test flow to report:

- Import check by running build.
- Confirm no page changed yet.
- Run `pnpm run build`.

Do not write automated tests.
