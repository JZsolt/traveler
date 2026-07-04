# 10-05 — Extract TripPage Hooks ✅ DONE

Read only:

- `src/pages/TripPage.jsx`
- `src/hooks/`
- `src/lib/`
- directly imported TripPage dependencies

Goal: reduce `TripPage.jsx` by moving workflow logic into custom hooks.

Requirements:

1. Extract trip deletion workflow into a hook if it materially reduces page complexity.
2. Extract day expansion workflow into a hook if it materially reduces page complexity.
3. Extract JSON export helper into `src/lib/` if repeated or bulky.
4. Keep `TripPage.jsx` focused on composition and rendering.
5. Preserve all behavior.
6. Do not change UI design.
7. Do not change route behavior.
8. Keep new hook/helper names simple.

Manual test flow to report:

- Open a trip page.
- Trigger or describe delete modal behavior.
- Trigger or describe day expansion behavior.
- Confirm JSON export still works.
- Run `pnpm run build`.

Do not write automated tests.
