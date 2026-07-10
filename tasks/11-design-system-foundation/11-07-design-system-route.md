# 11-07 — Design System Route ✅ DONE

Read only:

- `docs/design/`
- `src/App.tsx`
- `src/pages/`
- `src/components/ui/`
- `src/components/editor/`

Goal: add a developer reference page for the design system.

Requirements:

1. Add route `/design-system`.
2. Add `src/pages/DesignSystemPage.tsx`.
3. Show examples of:
   - colors/tokens
   - typography
   - buttons
   - badges
   - cards
   - sections
   - rows
   - empty/loading/error states
   - timeline
   - editable/AI states if easy to show without data fetching
4. Keep it developer-only by convention; do not link it prominently from public UI.
5. Do not add new dependencies.
6. Do not change product pages.
7. Update `docs/design/IMPLEMENTATION_PLAN.md` Phase 4 status when complete.

Manual test flow to report:

- Open `/design-system`.
- Confirm examples render on mobile width.
- Run `pnpm run build`.

Do not write automated tests.
