# 09 — Admin Settings + Password Lock

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

---

## TASK 1 — Add admin password check endpoint

Read only:

- `api/`
- `package.json`

Goal:

Create a small server endpoint that validates the admin password from env.

Requirements:

1. Create `/api/admin-login.js`.
2. Only allow `POST`.
3. Read `ADMIN_PASSWORD` from server env.
4. Accept request body:

```json
{
  "password": "user input"
}
```

5. Return:

```json
{
  "ok": true
}
```

6. For missing/invalid password, return:

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_ADMIN_PASSWORD",
    "message": "Hibás admin jelszó."
  }
}
```

7. For missing env, return a readable config error.
8. Never return the expected password.
9. Never log the submitted password.

Manual test flow to document:

- POST correct password and confirm `ok: true`.
- POST wrong password and confirm readable error.
- Temporarily remove `ADMIN_PASSWORD` and confirm readable config error.

Stop after this task.
Run `pnpm run build`.

---

## TASK 2 — Add client admin session helper

Read only:

- `src/lib/`
- `src/context/`
- `src/App.jsx`

Goal:

Add a tiny client-side admin state layer for the current browser session.

Requirements:

1. Add a small admin auth helper or context.
2. Store only an unlocked flag in `sessionStorage`.
3. Do not store the password.
4. Expose:
   - `isAdminUnlocked`
   - `unlockAdmin(password)`
   - `lockAdmin()`
5. `unlockAdmin(password)` must call `POST /api/admin-login`.
6. Show returned error messages to the caller.
7. Keep names simple and avoid broad abstractions.

Manual test flow to document:

- Unlock with correct password.
- Refresh the page and confirm admin remains unlocked in the same tab session.
- Lock admin and confirm admin state is cleared.
- Close/reopen browser session and confirm admin is locked again.

Stop after this task.
Run `pnpm run build`.

---

## TASK 3 — Create Settings page with password gate

Read only:

- `src/App.jsx`
- `src/pages/`
- `src/components/`
- `src/context/`

Goal:

Create a dedicated Settings page that asks for the admin password before showing admin controls.

Requirements:

1. Add route `/settings`.
2. Add `SettingsPage`.
3. Add a header/nav link or icon link to Settings.
4. If locked, show:
   - password input
   - unlock button
   - readable error message
5. If unlocked, show:
   - admin status
   - lock button
   - empty sections for future admin controls
6. Use existing UI style and components.
7. Keep the page functional on mobile.
8. Do not place admin controls on public pages in this task.

Manual test flow to document:

- Open `/settings`.
- Confirm password form is shown while locked.
- Enter wrong password and confirm readable error.
- Enter correct password and confirm admin controls appear.
- Click lock and confirm the password form returns.

Stop after this task.
Run `pnpm run build`.

---

## TASK 4 — Move backup/export-to-Git into Settings

Read only:

- `src/pages/HomePage.jsx`
- `src/pages/SettingsPage.jsx`
- `src/components/BackupButton.jsx`
- `api/backup-trips.js`

Goal:

Move the Git backup export button out of public pages and into unlocked Settings.

Requirements:

1. Remove `BackupButton` from public/home page.
2. Render `BackupButton` only inside unlocked Settings.
3. Keep the button label Hungarian, for example `Export mentés Gitre`.
4. Make `/api/backup-trips` require admin validation.
5. The backup request must send admin proof without exposing `ADMIN_PASSWORD` in code.
6. If admin validation fails, return a readable UI-safe error.
7. Keep existing backup success/error states.

Implementation note:

- For this solo-user phase, it is acceptable to re-prompt for the admin password inside Settings before backup, then send that password only with the current backup request body/header.
- Do not persist the password in storage.
- Do not rely on the client-side unlocked flag for server-side backup authorization.

Manual test flow to document:

- Confirm the backup button is no longer visible on Home.
- Unlock Settings.
- Trigger backup and confirm success state.
- Lock Settings and confirm backup cannot be triggered.
- Call backup without admin proof and confirm it fails with readable error.

Stop after this task.
Run `pnpm run build`.

---

## TASK 5 — Protect create/edit/delete entry points

Read only:

- `src/App.jsx`
- `src/pages/CreateTripPage.jsx`
- `src/pages/EditTripPage.jsx`
- `src/pages/TripPage.jsx`
- `src/context/`

Goal:

Hide or guard trip mutation actions unless admin is unlocked.

Requirements:

1. Protect `/create-trip`.
2. Protect `/trip/:slug/edit`.
3. Hide edit/delete buttons on Trip page while locked.
4. If a locked user opens a protected route directly, show a small admin unlock prompt or redirect to `/settings`.
5. After successful unlock, allow the intended action.
6. Do not hide public read-only trip pages.
7. Do not change trip rendering.

Manual test flow to document:

- Locked state: create route is blocked.
- Locked state: edit route is blocked.
- Locked state: edit/delete buttons are hidden.
- Unlock admin and confirm create/edit/delete controls appear.
- Refresh and confirm the session behavior matches Task 2.

Stop after this task.
Run `pnpm run build`.

---

## TASK 6 — Add admin protection checklist for future editor tasks

Read only:

- `tasks/08-inline-trip-editor.md`
- `tasks/09-admin-settings-lock.md`

Goal:

Document how future inline editor work should respect the admin gate.

Requirements:

1. Add a short note to the inline editor task index.
2. State that editor controls must only render when admin is unlocked.
3. State that future AI/edit mutation endpoints must validate admin access server-side when they write data.
4. Keep the note short.

Manual test flow to document:

- Read the task index.
- Confirm the admin requirement is clear before starting future editor tasks.

Stop after this task.
Run `pnpm run build`.
