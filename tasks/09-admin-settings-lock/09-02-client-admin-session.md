# 09-02 — Client Admin Session Helper

Read only:

- `src/lib/`
- `src/context/`
- `src/App.jsx`

Goal: add a tiny client-side admin state layer for the current browser session.

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
8. Keep the implementation browser-safe for Vite.

Manual test flow to report:

- Unlock with correct password.
- Refresh the page and confirm admin remains unlocked in the same tab session.
- Lock admin and confirm admin state is cleared.
- Close/reopen browser session and confirm admin is locked again.

Do not write automated tests.
Run `pnpm run build`.
