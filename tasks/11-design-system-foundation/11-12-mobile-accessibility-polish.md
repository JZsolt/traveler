# 11-12 — Mobile And Accessibility Polish

Read only:

- `docs/design/ICON_SYSTEM.md`
- `docs/design/IMPLEMENTATION_PLAN.md`
- changed files from phase 10
- key pages/components migrated in phase 10

Goal: final polish pass after design-system migration tasks.

Requirements:

1. Check mobile widths, especially iPhone 12 mini.
2. Fix horizontal overflow introduced by phase 10.
3. Ensure icon-only buttons have `aria-label`.
4. Ensure loading/empty/error states use shared primitives where practical.
5. Ensure Lucide icons are used for interactive UI icons.
6. Do not redesign pages in this task.
7. Update `docs/design/IMPLEMENTATION_PLAN.md` Phase 8 status when complete.
8. Add a short note summarizing any known remaining design debt.

Manual test flow to report:

- Home mobile spot check.
- Trip page mobile spot check.
- Day schedule mobile spot check.
- Create trip mobile spot check.
- Keyboard focus spot check for main action buttons.
- Run `pnpm run build`.

Do not write automated tests.
