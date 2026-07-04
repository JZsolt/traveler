# 10-06 — Extract DaySection Hooks ✅ DONE

Read only:

- `src/components/DaySection.jsx`
- `src/hooks/`
- `src/lib/tripSections.js`
- `src/components/editor/`
- `api/expand-day.js`

Goal: reduce `DaySection.jsx` by extracting stateful editor workflows.

Requirements:

1. Extract day metadata editor state into a hook if practical.
2. Extract advanced JSON editor state into a hook if practical.
3. Extract schedule AI draft workflow into a hook if practical.
4. Preserve:
   - dirty-state confirmation
   - pending AI schedule draft behavior
   - manual save/discard behavior
   - move/delete/add day behavior
5. Do not change rendered behavior.
6. Do not change API contracts.
7. Keep the component readable and below the target size if practical.

Manual test flow to report:

- Edit day title/subtitle.
- Cancel dirty edit and confirm warning.
- Open advanced JSON editor and cancel/save.
- Generate/apply/discard schedule AI draft or describe if AI env unavailable.
- Run `pnpm run build`.

Do not write automated tests.
