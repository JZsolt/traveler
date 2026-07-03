# 09-03 — Settings Page Password Gate

Read only:

- `src/App.jsx`
- `src/pages/`
- `src/components/`
- `src/context/`

Goal: create a dedicated Settings page that asks for the admin password before showing admin controls.

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
9. Do not redesign Home or Trip pages.

Manual test flow to report:

- Open `/settings`.
- Confirm password form is shown while locked.
- Enter wrong password and confirm readable error.
- Enter correct password and confirm admin controls appear.
- Click lock and confirm the password form returns.

Do not write automated tests.
Run `pnpm run build`.
