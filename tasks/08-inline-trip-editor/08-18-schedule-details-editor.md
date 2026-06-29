# 08-18 — Schedule Details Editor

Read only:

- `src/components/ScheduleItem.jsx`
- `src/components/GuideInfo.jsx`
- `src/hooks/useTripUpdater.js`
- `src/lib/tripSections.js`

Goal: edit structured details of schedule item.

Editable fields:

- `badges[]`
- `links[]`
- `transport[]`
- `guide.history[]`
- `guide.mustSee[]`
- `guide.funFacts[]`
- `guide.tips[]`

Requirements:

1. Add collapsible details editor inside item edit mode.
2. Support add/edit/delete/move for each array.
3. Link shape: `{ "label": "", "url": "" }`.
4. Transport shape: `{ "type": "", "label": "", "url": "" }`.
5. Preserve unknown guide fields.
6. Save updates only that item.
7. No AI.

Manual test flow to report:

- Add link.
- Add guide tip.
- Save and confirm `GuideInfo` renders.
- Build passes.

Run `pnpm run build`.
