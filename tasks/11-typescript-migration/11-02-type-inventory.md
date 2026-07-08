# 11-02 — Type Inventory ✅ DONE

Read only:

- `src/data/trips/_template.json`
- `src/lib/normalizeTrip.js`
- `src/lib/tripSections.js`
- `src/components/DaySection.jsx`
- `src/components/ScheduleItem.jsx`
- `src/components/trip/TripHero.jsx`
- `api/`
- `docs/architecture/ARCHITECTURE.md`

Goal: document the concrete type surfaces before creating shared types.

Requirements:

1. Create `docs/architecture/TYPESCRIPT.md`.
2. Document the primary domain models:
   - `Trip`
   - `Day`
   - `ScheduleItem`
   - `Guide`
   - `Link`
   - `Cost`
   - `Alert`
   - `Accommodation`
   - `Budget`
3. Document external/unsafe boundaries:
   - Supabase rows
   - JSON import/export
   - AI endpoint responses
   - browser storage
4. Document migration rules for `unknown`, casts, and the zero-`any` policy.
5. Document that `Trip`, `Day`, and `ScheduleItem` must have one canonical definition only.
6. Do not change application code in this task.
7. Keep the document concise and implementation-oriented.

Manual test flow to report:

- Confirm inventory source files were inspected.
- Run `pnpm run build`.

Do not write automated tests.
