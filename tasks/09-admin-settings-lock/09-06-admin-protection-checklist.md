# 09-06 — Admin Protection Checklist For Future Editor Tasks

Read only:

- `tasks/08-inline-trip-editor.md`
- `tasks/09-admin-settings-lock.md`
- `tasks/09-admin-settings-lock/`

Goal: document how future inline editor work should respect the admin gate.

Requirements:

1. Add a short note to the inline editor task index.
2. State that editor controls must only render when admin is unlocked.
3. State that future AI/edit mutation endpoints must validate admin access server-side when they write data.
4. Keep the note short.
5. Mark 09 task index statuses accurately.

Manual test flow to report:

- Read the task index.
- Confirm the admin requirement is clear before starting future editor tasks.

Do not write automated tests.
Run `pnpm run build`.
