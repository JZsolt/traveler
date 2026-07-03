# 10-04 — Shared Editor Patterns Audit

Read only:

- `src/components/editor/`
- `src/components/trip/`
- `src/components/DaySection.jsx`
- `src/components/ScheduleItem.jsx`
- `docs/architecture/ARCHITECTURE.md`

Goal: identify repeated editor patterns before extracting shared components.

Requirements:

1. Audit repeated editor patterns:
   - dirty cancel confirmation
   - save/cancel button rows
   - add/delete/reorder controls
   - validation error display
   - AI suggestion panels
   - list editors
2. Add a short extraction plan to `docs/architecture/ARCHITECTURE.md`.
3. Identify which extractions are safe and which should wait.
4. Do not refactor code in this task.

Manual test flow to report:

- Report repeated patterns and proposed target components/hooks.
- Confirm no application code changed.
- Run `pnpm run build`.

Do not write automated tests.
