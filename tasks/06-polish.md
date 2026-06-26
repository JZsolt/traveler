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

---

## TASK 5 — Sort trips by upcoming start date

Read only:

- src/context/TripsContext.jsx
- src/pages/HomePage.jsx
- src/lib

Goal:

Always display trips in a meaningful chronological order.

Requirements:

1. Sort trips by `startDate`.
2. Upcoming trips should always appear first.
3. Past trips should appear after all upcoming trips.
4. Within upcoming trips:
   - the closest upcoming trip comes first.
5. Within past trips:
   - the most recently finished trip comes first.
6. The sorting must happen before rendering the trip list.
7. Do not modify the database.
8. Do not modify the stored trip JSON.
9. Create a reusable helper if appropriate (for example `src/lib/sortTrips.js`).
10. Handle missing or invalid dates gracefully without crashing.
11. Do not redesign the UI.

Example:

Today: 2026-06-26

Trips:

- 2026-06-28 → #1
- 2026-07-10 → #2
- 2026-08-01 → #3
- 2026-06-20 → #4
- 2026-05-01 → #5

Displayed order:

1. 2026-06-28
2. 2026-07-10
3. 2026-08-01
4. 2026-06-20
5. 2026-05-01

Stop after this task.
Run `npm run build`.
