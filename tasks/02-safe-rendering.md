TASK 1 — Make empty/new trips render safely ✅ DONE

Goal:
A newly created trip with empty days/highlights must not crash the app.

Requirements:

1. Audit components used by TripPage.
2. Add safe fallbacks for optional fields.
3. If trip.days is empty, show a friendly message:
   "Még nincs napi terv ehhez az utazáshoz."
4. If highlights is empty, HomePage should still render cleanly.
5. Do not redesign the UI.
6. Do not add AI.
7. Do not change Supabase schema.

Stop after this task and summarize changed files.
Run npm run build.

# 02 — Safe rendering and empty states

This phase makes the UI robust for newly created trips and partially filled trip JSON.

Important:

- Implement one task at a time.
- Do not add AI in this phase.
- Do not change Supabase schema.
- Do not redesign the UI.
- Prefer small defensive fallbacks over large rewrites.
- Run `npm run build` after each task.
- Stop after each task and summarize changed files.

---

## TASK 1 — Make empty/new trips render safely ✅ DONE (null guards added, empty days/highlights handled)

Read the existing code first, but only inspect:

- src/App.jsx
- src/context/TripsContext.jsx
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/components

Goal:
A newly created trip with empty `days` and `highlights` must not crash the app.

Requirements:

1. Audit components used by HomePage and TripPage.
2. Add safe fallbacks for optional fields.
3. If `trip.days` is missing or empty, TripPage should show:
   "Még nincs napi terv ehhez az utazáshoz."
4. If `trip.highlights` is missing or empty, HomePage and TripPage should still render cleanly.
5. If `trip.people` is missing, show no people section or show a small fallback without crashing.
6. If `trip.emoji` is missing, use a neutral fallback emoji.
7. If `trip.subtitle` is missing, avoid rendering broken or undefined text.
8. If dates are missing, avoid rendering broken or invalid date output.
9. Do not redesign the UI.
10. Do not add AI.
11. Do not change Supabase schema.

Stop after this task and summarize changed files.
Run `npm run build`.

---

## TASK 2 — Add reusable trip normalization helper ✅ DONE

Read the existing code first, but only inspect:

- src/context/TripsContext.jsx
- src/lib
- src/pages/HomePage.jsx
- src/pages/TripPage.jsx
- src/components

Goal:
Centralize trip defaults so the UI receives predictable trip objects.

Requirements:

1. Create a small helper, for example `src/lib/normalizeTrip.js`.
2. The helper should accept raw trip data and return a safe normalized trip object.
3. It should provide defaults for:
   - slug
   - title
   - subtitle
   - startDate
   - endDate
   - emoji
   - people
   - highlights
   - days
4. Use this helper where trips are loaded from Supabase.
5. Do not change the database shape.
6. Do not redesign UI components.
7. Do not add AI.

Stop after this task and summarize changed files.
Run `npm run build`.
