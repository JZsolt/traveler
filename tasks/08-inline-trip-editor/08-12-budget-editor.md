# 08-12 — Budget Summary Editor

Read only:

- `src/components/trip/BudgetSummary.jsx`
- `src/hooks/useTripUpdater.js`

Goal: inline edit budget summary.

Editable fields:

- `budget.headline`
- `budget.summaryLabel`
- `budget.lowPerFamily`
- `budget.lowPerFamilyLabel`
- `budget.comfortPerFamily`
- `budget.comfortPerFamilyLabel`
- `budget.lowTotal`
- `budget.lowTotalLabel`
- `budget.comfortTotal`
- `budget.comfortTotalLabel`

Requirements:

1. Add edit mode to `BudgetSummary`.
2. Initialize missing `budget`.
3. Preserve unknown budget fields.
4. Save updates only `budget`.
5. No AI.

Manual test flow to report:

- Edit one amount.
- Edit one label.
- Cancel and Save paths work.
- Build passes.

Run `pnpm run build`.
