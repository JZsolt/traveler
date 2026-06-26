TASK 1 — Add manual trip creation foundation only ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/components/Header.jsx

Goal:
Add the smallest possible manual "Create Trip" flow without AI.

Requirements:

1. Add route: /create-trip
2. Add a visible "Új utazás" button/link on HomePage.
3. Create src/pages/CreateTripPage.jsx.
4. The page should contain a simple form:
   - title
   - subtitle
   - startDate
   - endDate
   - emoji
   - people
5. On submit, create a minimal valid trip_data object compatible with existing UI:
   - slug
   - title
   - subtitle
   - startDate
   - endDate
   - emoji
   - people
   - highlights: []
   - days: []
6. Insert into Supabase table trips:
   - slug
   - trip_data
   - owner: null
7. After successful insert, navigate to /trip/:slug.
8. Do not add AI.
9. Do not refactor unrelated components.
10. Do not change the existing trip display UI.

Stop after this task and summarize changed files.
Run npm run build.

---

TASK 2 — Add manual trip edit flow only ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/pages/CreateTripPage.jsx
- src/components/Header.jsx

Goal:
Allow editing an existing trip without AI.

Requirements:

1. Add route: /trip/:slug/edit
2. Add a visible "Szerkesztés" button/link on TripPage.
3. Create src/pages/EditTripPage.jsx.
4. The page should load the existing trip by slug.
5. The page should contain a simple form:
   - title
   - subtitle
   - startDate
   - endDate
   - emoji
   - people
6. On submit, update the existing Supabase row.
7. Preserve existing fields in trip_data that are not part of the form, especially:
   - highlights
   - days
8. If the slug changes, update both:
   - trips.slug
   - trip_data.slug
9. After successful update, navigate to /trip/:slug.
10. Do not add AI.
11. Do not refactor unrelated components.
12. Do not change the existing trip display UI.

Stop after this task and summarize changed files.
Run npm run build.

---

TASK 3 — Add manual trip delete flow only ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/pages/EditTripPage.jsx
- src/components/Header.jsx

Goal:
Allow deleting an existing trip safely.

Requirements:

1. Add a visible "Törlés" button on EditTripPage, not on HomePage.
2. Clicking "Törlés" must show a confirmation step before deleting.
3. The confirmation text should clearly say that the trip will be permanently deleted.
4. Only delete after the user confirms.
5. Delete the matching Supabase row by slug.
6. After successful delete, navigate to HomePage.
7. Show a loading state while deleting.
8. Show an error message if delete fails.
9. Do not add AI.
10. Do not refactor unrelated components.
11. Do not change the existing trip display UI.

Stop after this task and summarize changed files.
Run npm run build.

# 01 — CRUD foundation

This file contains the basic manual trip management tasks.

Important:

- Implement one task at a time.
- Do not add AI in this phase.
- Do not redesign unrelated UI.
- Do not refactor unrelated files.
- Keep existing trip display behavior intact.
- Run `npm run build` after each task.
- Stop after each task and summarize changed files.

---

## TASK 1 — Add manual trip creation foundation only ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/components/Header.jsx

Goal:
Add the smallest possible manual "Create Trip" flow without AI.

Requirements:

1. Add route: `/create-trip`.
2. Add a visible "Új utazás" button/link on HomePage.
3. Create `src/pages/CreateTripPage.jsx`.
4. The page should contain a simple form:
   - title
   - subtitle
   - startDate
   - endDate
   - emoji
   - people
5. On submit, create a minimal valid `trip_data` object compatible with the existing UI:
   - slug
   - title
   - subtitle
   - startDate
   - endDate
   - emoji
   - people
   - highlights: []
   - days: []
6. Generate the slug from the title using a simple safe slug function.
7. Insert into Supabase table `trips`:
   - slug
   - trip_data
   - owner: null
8. Show a loading state while saving.
9. Show an error message if saving fails.
10. After successful insert, navigate to `/trip/:slug`.
11. Do not add AI.
12. Do not refactor unrelated components.
13. Do not change the existing trip display UI.

Stop after this task and summarize changed files.
Run `npm run build`.

---

## TASK 2 — Add manual trip edit flow only ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/pages/CreateTripPage.jsx
- src/components/Header.jsx

Goal:
Allow editing an existing trip without AI.

Requirements:

1. Add route: `/trip/:slug/edit`.
2. Add a visible "Szerkesztés" button/link on TripPage.
3. Create `src/pages/EditTripPage.jsx`.
4. The page should load the existing trip by slug.
5. The page should contain a simple form:
   - title
   - subtitle
   - startDate
   - endDate
   - emoji
   - people
6. Pre-fill the form from the existing trip.
7. On submit, update the existing Supabase row.
8. Preserve existing fields in `trip_data` that are not part of the form, especially:
   - highlights
   - days
9. If the slug changes, update both:
   - trips.slug
   - trip_data.slug
10. Show a loading state while updating.
11. Show an error message if updating fails.
12. After successful update, navigate to `/trip/:slug` using the updated slug.
13. Do not add AI.
14. Do not refactor unrelated components.
15. Do not change the existing trip display UI.

Stop after this task and summarize changed files.
Run `npm run build`.

---

## TASK 3 — Add manual trip delete flow only ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/pages/EditTripPage.jsx
- src/components/Header.jsx

Goal:
Allow deleting an existing trip safely.

Requirements:

1. Add a visible "Törlés" button on EditTripPage, not on HomePage.
2. Clicking "Törlés" must show a confirmation step before deleting.
3. The confirmation text should clearly say that the trip will be permanently deleted.
4. Only delete after the user confirms.
5. Delete the matching Supabase row by slug.
6. Show a loading state while deleting.
7. Show an error message if delete fails.
8. After successful delete, navigate to HomePage.
9. Do not add AI.
10. Do not refactor unrelated components.
11. Do not change the existing trip display UI.

Stop after this task and summarize changed files.
Run `npm run build`.
