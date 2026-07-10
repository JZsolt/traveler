# 09 — Admin Settings + Password Lock ✅ DONE

This phase moves admin-only actions behind a password gate and creates a dedicated Settings page.

Important:

- Keep this token-efficient: implement one task at a time.
- Read only the files listed in the current task.
- Do not redesign unrelated pages.
- Do not write automated tests for this phase.
- After every task, document a short manual test flow.
- Run `pnpm run build` after every task.
- Stop after each task and summarize changed files.

Security notes:

- Do not use `VITE_ADMIN_PASSWORD`.
- The password must come from server env only: `ADMIN_PASSWORD`.
- Never expose the password in frontend code, responses, logs, or error messages.
- This is a simple solo-user admin gate, not full multi-user authentication.
- Sensitive server endpoints, especially backup/export endpoints, must validate admin access server-side.

Admin actions for this phase:

- Create trip.
- Edit trip.
- Delete trip.
- Import/export JSON if present.
- Backup/export-to-Git button.
- Future inline editor entry points from phase 08.
- Any new Settings/Data Management controls.

## Subtasks

0. ~~`09-00-doc-cleanup.md`~~ ✅
1. ~~`09-01-admin-login-endpoint.md`~~ ✅
2. ~~`09-02-client-admin-session.md`~~ ✅
3. ~~`09-03-settings-page-password-gate.md`~~ ✅
4. ~~`09-04-move-backup-to-settings.md`~~ ✅
5. ~~`09-05-protect-mutation-entry-points.md`~~ ✅
6. ~~`09-06-admin-protection-checklist.md`~~ ✅

## Workflow

Open and implement exactly one task file from `tasks/09-admin-settings-lock/`, then stop.

Do not continue to the next task automatically.
