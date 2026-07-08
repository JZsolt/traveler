# 11-10 — Trip Components To TSX ✅ DONE

Converted:
- AlertBox.tsx, CostTable.tsx, GuideInfo.tsx, TransportOptions.tsx
- ScheduleItem.tsx, DaySection.tsx
- BookingChecklist.tsx, BudgetSummary.tsx, InsuranceLink.tsx, PackingList.tsx
- PracticalInfo.tsx, SavingTips.tsx, TripHero.tsx, TripOverview.tsx, UsefulLinks.tsx
- BackupButton.tsx, DbError.tsx, Header.tsx, ImportBackup.tsx
- src/types/components.ts (prop/state/result types)
- src/types/guards.ts (AI/API response narrowing used by converted components)

Notes:
- No trip-related `.jsx` component remains under `src/components/` or `src/components/trip/`.
- API/AI response handling uses `unknown` + guard before state/apply.
- File-size debt remains for DaySection, TripHero, PracticalInfo, and the aggregate type/guard files; split this in the follow-up component extraction phase instead of mixing it into the TS conversion.

Scope:

- `src/components/trip/`
- `src/components/DaySection.jsx`
- `src/components/ScheduleItem.jsx`
- `src/components/CostTable.jsx`
- `src/components/TransportOptions.jsx`
- `src/components/GuideInfo.jsx`
- `src/components/AlertBox.jsx`
- `src/types/`
- files importing changed components

Goal: convert trip display/editor components to TSX.

Requirements:

1. Convert trip-related components from `.jsx` to `.tsx` in small groups.
2. Type props using shared trip/editor types.
3. Do not define inline props, `Trip`, `Day`, `ScheduleItem`, or `Activity` types in component files.
4. Keep unknown data fields preserved during saves.
5. Preserve admin lock/readOnly behavior.
6. Preserve pending AI draft behavior.
7. Preserve all visible copy unless a type-safe fallback needs a minor wording fix.
8. Do not redesign trip UI.
9. If this task becomes too large, stop after a coherent subset and document what remains.

Manual test flow to report:

- Open a trip page locked and unlocked.
- Edit hero/budget/simple sections.
- Edit schedule item details.
- Confirm cost table uses dynamic person count.
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.

Verification:

- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run lint` still fails on existing non-11-10 baseline files.
