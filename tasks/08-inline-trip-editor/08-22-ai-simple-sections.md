# 08-22 — AI For Remaining Simple Sections

Read only:

- `api/suggest-trip-section.js`
- `src/components/trip/UsefulLinks.jsx`
- `src/components/trip/SavingTips.jsx`
- `src/components/trip/PracticalInfo.jsx`
- `src/components/trip/BookingChecklist.jsx`
- `src/components/editor/EditableSection.jsx`

Goal: add AI suggestions to remaining simple sections.

Sections:

- `usefulLinks`
- `savingTips`
- `practicalInfo`
- `bookingChecklist`

Requirements:

1. Extend endpoint one section at a time.
2. Validate response shape per section.
3. Add UI button/instruction/preview/apply/discard per section.
4. Do not auto-save.
5. Save remains manual.
6. Show section-local AI loading and error states.
7. Use standard user-facing AI errors.
8. Retry keeps instruction and unsaved manual edits.

Manual test flow to report for each section:

- Happy path.
- API/server error visible in UI.
- 429 visible in UI.
- Token limit visible in UI.
- Invalid JSON/shape visible in UI.
- Apply/discard works.
- Build passes.

Do not write automated tests.
Run `pnpm run build`.
