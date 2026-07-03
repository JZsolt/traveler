# 10-02 — CSS Design Tokens

Read only:

- `docs/design/VISUAL_LANGUAGE.md`
- `docs/design/IMPLEMENTATION_PLAN.md`
- `src/index.css`
- `src/App.css`

Goal: add the minimal design tokens needed for future primitives.

Requirements:

1. Add CSS variables for:
   - paper/background
   - ink/body/muted text
   - line/border
   - primary
   - accent/AI
   - radius scale
   - soft/card shadows
2. Do not migrate pages in this task.
3. Do not remove existing variables unless clearly duplicate and unused.
4. Keep existing app appearance as stable as possible.
5. Update `docs/design/IMPLEMENTATION_PLAN.md` Phase 2 status when complete.

Manual test flow to report:

- Open Home and one Trip page.
- Confirm no obvious visual regression.
- Run `pnpm run build`.

Do not write automated tests.
