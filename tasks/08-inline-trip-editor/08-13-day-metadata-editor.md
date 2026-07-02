# 08-13 — Day Metadata Editor ✅ DONE

Read only:

- `src/components/DaySection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: edit a single day's title/subtitle.

Editable fields:

- `day.title`
- `day.subtitle`

Requirements:

1. Add edit mode to day header.
2. Save updates only that day.
3. Preserve schedule, images, tickets, costs and unknown day fields.
4. Cancel restores persisted values.
5. Do not add/delete/reorder days.
6. No AI.

Manual test flow to report:

- Edit one day title.
- Confirm other days unchanged.
- Cancel path works.
- Build passes.

Run `pnpm run build`.
