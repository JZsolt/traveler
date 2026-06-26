# 06 — Polish and product quality

This phase improves UX after the core features are complete.

Important:

- Only start this phase after CRUD, Safe Rendering, JSON Import/Export, Gemini Backend and AI Chat are finished.
- Implement one task at a time.
- Do not introduce new architecture.
- Run `npm run build` after each task.
- Stop after each task and summarize changed files.

---

## TASK 1 — Improve loading and error states

Read only:

- src/context
- src/pages
- src/components

Goal:
Make loading and error handling consistent across the app.

Requirements:

1. Show loading states while fetching, saving, updating and deleting trips.
2. Replace raw errors with user-friendly messages.
3. Keep detailed errors in the console for debugging.
4. Do not redesign the UI.

Stop after this task.
Run `npm run build`.

---

## TASK 2 — Mobile UX improvements

Read only:

- src/pages/CreateTripPage.jsx
- src/pages/EditTripPage.jsx
- src/components

Goal:
Make all create/edit flows comfortable on mobile.

Requirements:

1. Ensure inputs are easy to tap.
2. Ensure buttons never overflow.
3. Improve textarea usability.
4. Ensure AI chat works well on small screens.
5. Do not redesign unrelated pages.

Stop after this task.
Run `npm run build`.

---

## TASK 3 — Duplicate slug handling

Read only:

- src/pages/CreateTripPage.jsx
- src/pages/EditTripPage.jsx
- src/lib

Goal:
Prevent duplicate trip slugs.

Requirements:

1. Check whether a slug already exists before creating a trip.
2. If it exists:
   - show a clear validation error, or
   - generate a unique slug by appending a short suffix.
3. Apply the same logic to:
   - manual create
   - JSON import
   - AI save
4. When editing, allow keeping the current slug.
5. If changing to an existing slug, prevent saving.
6. Do not change the database schema.

Stop after this task.
Run `npm run build`.

---

## TASK 4 — Final cleanup

Goal:
Prepare the project for production.

Requirements:

1. Remove dead code and unused imports.
2. Remove temporary debug logs.
3. Check for consistent loading/error UX.
4. Verify all routes work.
5. Verify the app builds successfully.
6. Verify the PWA still works correctly.
7. Do not introduce new features.

Stop after this task.
Run `npm run build`.
