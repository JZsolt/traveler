# 10-10 — Theme And Style Audit

Read only:

- `docs/design/`
- `src/`
- global CSS files

Goal: identify inline styles and hard-coded theme values before design-system migration.

Requirements:

1. Audit inline `style={{ ... }}` usage.
2. Audit repeated hard-coded colors.
3. Audit repeated spacing/radius/shadow values.
4. Add a short audit note to `docs/design/IMPLEMENTATION_PLAN.md`.
5. Fix only low-risk inline styles that are clearly unnecessary.
6. Do not redesign pages.
7. Do not introduce design tokens in this task unless already available.

Manual test flow to report:

- Report inline style locations and which should remain.
- Report repeated hard-coded colors.
- Run `pnpm run build`.

Do not write automated tests.
