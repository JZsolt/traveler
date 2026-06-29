# 08-09 — Hero Basic Info Editor

Read only:

- `src/components/trip/TripHero.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/dateUtils.js`

Goal: inline edit main trip identity fields.

Editable fields:

- `title`
- `emoji`
- `people`
- `startDate`
- `endDate`

Requirements:

1. Add edit mode to `TripHero`.
2. Save updates listed fields plus recalculated `subtitle`.
3. Use existing date helper for `subtitle`.
4. Date inputs: one column on mobile, two columns from `sm`.
5. Do not change `slug`.
6. Cancel restores persisted values.
7. Do not edit accommodation/flight here.
8. No AI.

Manual test flow to report:

- Edit title; URL slug unchanged.
- Edit dates; subtitle changes.
- Cancel restores values.
- iPhone 12 mini: date fields do not overflow.
- Build passes.

Run `pnpm run build`.
