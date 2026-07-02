# 08-23 — AI For Day Metadata And Schedule Guide ✅ DONE

Read only:

- `api/suggest-trip-section.js`
- `src/components/DaySection.jsx`
- `src/components/ScheduleItem.jsx`
- `src/components/GuideInfo.jsx`
- `src/components/editor/EditableSection.jsx`

Goal: add AI suggestions for deeper content after simple sections work.

Supported sections:

- `day` for day `title` and `subtitle`
- `scheduleItemGuide` for `guide.history`, `guide.mustSee`, `guide.funFacts`, `guide.tips`

Requirements:

1. Endpoint accepts precise day/item identifiers.
2. Endpoint validates response shape.
3. Day response shape: `{ "title": "", "subtitle": "" }`.
4. Guide response shape:

```json
{ "history": [], "mustSee": [], "funFacts": [], "tips": [] }
```

5. UI shows instruction field, loading, preview, apply, discard.
6. Do not auto-save.
7. Retry keeps instruction and unsaved manual edits.
8. Standard user-facing AI errors for 429, token limit, invalid JSON, server error.

Manual test flow to report:

- Ask AI to shorten day title.
- Ask AI for 3 fun facts on one schedule item.
- Apply preview then Save.
- Discard preview.
- Trigger/describe each AI error state.
- Build passes.

Do not write automated tests.
Run `pnpm run build`.
