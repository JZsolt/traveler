# 11-07 — Day And Schedule Hooks To TypeScript ✅ DONE

Read only:

- `src/hooks/useDayMetaEditor.js`
- `src/hooks/useDayAdvancedEditor.js`
- `src/hooks/useDayScheduleAi.js`
- `src/hooks/useScheduleItemEditor.js`
- `src/lib/tripSections.js`
- `src/types/`
- files importing changed hooks

Goal: type editor hooks that manipulate day and schedule data.

Requirements:

1. Convert listed hooks from `.js` to `.ts`.
2. Type drafts, validation errors, dirty-state helpers, and save callbacks.
3. Keep pending AI schedule draft behavior unchanged.
4. Keep dirty cancel confirmation behavior unchanged.
5. Convert `tripSections.js` only if required by typed hook signatures; otherwise defer it.
6. Do not use `any` in editor state or callback signatures.
7. Do not define local `Day`, `ScheduleItem`, or `Activity` types.

Manual test flow to report:

- Edit day metadata and cancel dirty changes.
- Edit advanced JSON and validate bad JSON.
- Apply AI schedule draft, then save and discard.
- Edit schedule item title validation.
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
