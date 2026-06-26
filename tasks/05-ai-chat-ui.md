TASK 4 — Add Gemini serverless planning endpoint only

Goal:
Create backend endpoint, no UI integration yet.

Requirements:

1. Add Vercel serverless function: api/plan-trip.js
2. Read GEMINI_API_KEY from process.env.
3. Accept POST JSON:
   { messages: [{ role: "user" | "assistant", content: string }] }
4. Call Gemini Flash.
5. Ask Gemini to return only valid trip JSON compatible with existing Traveler schema.
6. Parse and validate JSON.
7. Return { trip: parsedTrip }.
8. Never expose GEMINI_API_KEY to frontend.
9. Add GEMINI_API_KEY to .env.example without value.
10. Do not modify trip UI.

Stop after this task and summarize changed files.
Run npm run build.

# 05 — AI chat UI and save flow

This phase connects the Gemini backend endpoint to the app UI.

Important:

- The Gemini key must stay server-side only.
- The frontend must call `/api/plan-trip`, not Gemini directly.
- Do not auto-save AI output.
- Always show preview before saving.
- Run `npm run build` after each task.
- Stop after each task and summarize changed files.

---

## TASK 1 — Add AI planner chat shell ✅ DONE

Read the existing code first, but only inspect:

- src/App.jsx
- src/pages/CreateTripPage.jsx
- src/context/TripsContext.jsx
- src/lib/supabase.js
- src/components

Goal:
Add an AI planning UI shell without calling the backend yet.

Requirements:

1. On `/create-trip`, add a third section or tab called "AI tervező".
2. Add a chat-like UI with:
   - message list
   - textarea/input
   - send button
3. Store messages in local component state.
4. Add an initial assistant message explaining what the user can ask for.
5. Sending a message should append it to the message list only.
6. Do not call `/api/plan-trip` yet.
7. Do not save anything to Supabase yet.
8. Do not redesign unrelated UI.

Stop after this task and summarize changed files.
Run `npm run build`.

---

## TASK 2 — Connect AI planner UI to `/api/plan-trip` ✅ DONE

Read the existing code first, but only inspect:

- src/pages/CreateTripPage.jsx
- src/lib/validateTripJson.js
- api/plan-trip.js

Goal:
Generate trip JSON from chat messages using the serverless endpoint.

Requirements:

1. Add a "Terv generálása" button in the AI planner section.
2. On click, POST the chat messages to `/api/plan-trip`.
3. Show a loading state while generating.
4. Show an error message if generation fails.
5. Store the returned `trip` in component state.
6. Do not auto-save the trip.
7. Show a preview of the generated trip:
   - title
   - subtitle
   - dates
   - number of days
   - number of highlights
8. Do not call Gemini directly from frontend.
9. Do not expose API keys.

Stop after this task and summarize changed files.
Run `npm run build`.

---

## TASK 3 — Save generated AI trip to Supabase ✅ DONE

Read the existing code first, but only inspect:

- src/pages/CreateTripPage.jsx
- src/lib/supabase.js
- src/lib/validateTripJson.js

Goal:
Allow the user to save the generated AI trip after preview.

Requirements:

1. Add a "Mentés" button near the AI-generated preview.
2. Validate the generated trip before saving.
3. Save to Supabase table `trips`:
   - slug
   - trip_data
   - owner: null
4. Show a loading state while saving.
5. Show an error message if saving fails.
6. After successful save, navigate to `/trip/:slug`.
7. Do not auto-save.
8. Do not redesign unrelated UI.

Stop after this task and summarize changed files.
Run `npm run build`.
