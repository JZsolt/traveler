# 09-05 — Protect Create, Edit And Delete Entry Points ✅ DONE

Read only:

- `src/App.jsx`
- `src/pages/CreateTripPage.jsx`
- `src/pages/EditTripPage.jsx`
- `src/pages/TripPage.jsx`
- `src/context/`

Goal: hide or guard trip mutation actions unless admin is unlocked.

Requirements:

1. Protect `/create-trip`.
2. Protect `/trip/:slug/edit`.
3. Hide edit/delete buttons on Trip page while locked.
4. Hide future inline editor entry points from phase 08 while locked.
5. If a locked user opens a protected route directly, show a small admin unlock prompt or redirect to `/settings`.
6. After successful unlock, allow the intended action.
7. Do not hide public read-only trip pages.
8. Do not change trip rendering.

Manual test flow to report:

- Locked state: create route is blocked.
- Locked state: edit route is blocked.
- Locked state: edit/delete buttons are hidden.
- Locked state: inline editor controls are hidden.
- Unlock admin and confirm create/edit/delete/editor controls appear.
- Refresh and confirm the session behavior matches Task 2.

Do not write automated tests.
Run `pnpm run build`.
