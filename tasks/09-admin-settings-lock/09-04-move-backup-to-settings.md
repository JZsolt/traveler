# 09-04 — Move Backup Export To Settings

Read only:

- `src/pages/HomePage.jsx`
- `src/pages/SettingsPage.jsx`
- `src/components/BackupButton.jsx`
- `api/backup-trips.js`

Goal: move the Git backup export button out of public pages and into unlocked Settings.

Requirements:

1. Remove `BackupButton` from public/Home page.
2. Render `BackupButton` only inside unlocked Settings.
3. Keep the button label Hungarian, for example `Export mentés Gitre`.
4. Make `/api/backup-trips` require admin validation.
5. The backup request must send admin proof without exposing `ADMIN_PASSWORD` in code.
6. If admin validation fails, return a readable UI-safe error.
7. Keep existing backup success/error states.
8. Do not rely on the client-side unlocked flag for server-side backup authorization.

Implementation note:

- For this solo-user phase, it is acceptable to re-prompt for the admin password inside Settings before backup, then send that password only with the current backup request body/header.
- Do not persist the password in storage.

Manual test flow to report:

- Confirm the backup button is no longer visible on Home.
- Unlock Settings.
- Trigger backup and confirm success state.
- Lock Settings and confirm backup cannot be triggered.
- Call backup without admin proof and confirm it fails with readable error.

Do not write automated tests.
Run `pnpm run build`.
