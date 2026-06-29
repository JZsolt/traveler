# 08-16 — Schedule Item Basic Editor

Read only:

- `src/components/ScheduleItem.jsx`
- `src/components/DaySection.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: edit common fields of one schedule item.

Editable fields:

- `time`
- `title`
- `desc`
- `highlight`
- `optional`

Requirements:

1. Each schedule item gets Edit button.
2. Structured inputs for listed fields.
3. Save updates only that item.
4. Preserve all other item fields.
5. Cancel restores persisted values.
6. Do not edit badges/links/guide/transport.
7. No AI.

Manual test flow to report:

- Edit time/title/desc.
- Toggle highlight/optional.
- Confirm rendered item still works.
- Build passes.

Run `pnpm run build`.
