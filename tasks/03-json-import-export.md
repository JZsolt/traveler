TASK 3 — Add editable JSON preview for a new trip

Goal:
Before AI integration, allow creating a trip from pasted JSON.

Requirements:

1. On /create-trip add a second tab/section: "JSON import".
2. User can paste trip JSON.
3. Validate required fields:
   - slug
   - title
   - startDate
   - endDate
4. Show validation errors.
5. Show preview title before save.
6. Save valid JSON to Supabase trips table.
7. Navigate to /trip/:slug after save.
8. Do not add AI yet.

Stop after this task and summarize changed files.
Run npm run build.

# 03 — JSON import and export

This phase adds manual JSON workflows before AI integration.

Important:

- Implement one task at a time.
- Do not add AI in this phase.
- Do not redesign unrelated UI.
- Keep the app Vercel-compatible.
- Run `npm run build` after each task.
- Stop after each task and summarize changed files.

---

## TASK 1 — Add editable JSON import for a new trip ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/pages/CreateTripPage.jsx
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx

Goal:
Before AI integration, allow creating a trip from pasted JSON.

Requirements:

1. On `/create-trip`, add a second section or tab called "JSON import".
2. User can paste trip JSON into a textarea.
3. Parse the JSON safely.
4. Validate required fields:
   - slug
   - title
   - startDate
   - endDate
5. If `highlights` is missing, default it to `[]`.
6. If `days` is missing, default it to `[]`.
7. Show validation errors clearly.
8. Show a small preview before saving:
   - title
   - subtitle if present
   - startDate and endDate
9. Save valid JSON to Supabase table `trips`:
   - slug
   - trip_data
   - owner: null
10. Navigate to `/trip/:slug` after save.
11. Do not add AI yet.
12. Do not refactor unrelated components.

Stop after this task and summarize changed files.
Run `npm run build`.

---

## TASK 2 — Add JSON export for existing trips ✅ DONE

Read the existing code first, but only inspect:

- src/pages/TripPage.jsx
- src/context/TripsContext.jsx
- src/lib
- src/components

Goal:
Allow exporting the current trip as a JSON file for backup and debugging.

Requirements:

1. Add an "Export JSON" button on TripPage.
2. Clicking it should download the current trip as a `.json` file.
3. The filename should use the trip slug, for example `italy-2026.json`.
4. The exported JSON should be pretty-printed with 2-space indentation.
5. Do not modify the Supabase schema.
6. Do not add AI.
7. Do not redesign the page.

Stop after this task and summarize changed files.
Run `npm run build`.

---

## TASK 3 — Add JSON validation helper ✅ DONE

Read the existing code first, but only inspect:

- src/lib
- src/pages/CreateTripPage.jsx
- src/pages/EditTripPage.jsx

Goal:
Create one reusable validation helper for trip JSON.

Requirements:

1. Create `src/lib/validateTripJson.js`.
2. The helper should validate:
   - slug exists and is a string
   - title exists and is a string
   - startDate exists
   - endDate exists
   - days is an array if present
   - highlights is an array if present
3. The helper should return a structured result:
   - valid boolean
   - errors array
   - normalizedTrip object when valid
4. Use this helper in the JSON import flow.
5. Do not add AI.
6. Do not redesign the UI.

Stop after this task and summarize changed files.
Run `npm run build`.
