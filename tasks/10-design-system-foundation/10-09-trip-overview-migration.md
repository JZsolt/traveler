# 10-09 — Trip Overview Migration

Read only:

- `docs/design/VISUAL_LANGUAGE.md`
- `docs/product/SCREEN_LIBRARY.md`
- `src/pages/TripPage.jsx`
- `src/components/trip/TripOverview.jsx`
- `src/components/trip/TripHero.jsx`
- `src/components/trip/BudgetSummary.jsx`
- `src/components/ui/`

Goal: migrate only the trip overview shell toward the design system.

Requirements:

1. Use `Page`, `Section`, or `Row` where they remove one-off layout.
2. Preserve all trip rendering and editor behavior.
3. Preserve admin-gated controls if phase 09 has already added them.
4. Keep AI/edit flows unchanged.
5. Keep the trip hero recognizable.
6. Do not migrate day schedule rendering in this task.
7. Update `docs/design/IMPLEMENTATION_PLAN.md` Phase 5 status when complete.

Manual test flow to report:

- Open one trip.
- Overview table/summary still renders.
- Budget editor still works if available.
- Hero edit still works if available.
- Mobile width has no horizontal overflow.
- Run `pnpm run build`.

Do not write automated tests.
