# 11-04 — Lib Helpers To TypeScript ✅ DONE

Read only:

- `src/lib/`
- `src/types/`
- files importing changed `src/lib/` modules

Goal: convert pure helper modules to TypeScript first.

Requirements:

1. Convert small pure helpers from `.js` to `.ts`:
   - `constants.js`
   - `dateUtils.js`
   - `friendlyError.js`
   - `personCount.js`
   - `sortTrips.js`
   - `ensureUniqueSlug.js`
   - `extractLocationName.js`
   - `exportTripJson.js`
   - `createTripHelpers.js`
2. Add parameter and return types using `src/types/` where relevant.
3. Keep behavior exactly the same.
4. Update imports only as needed.
5. Do not convert Supabase or complex trip mutation helpers in this task.
6. No `any` and no `as any` casts.
7. Do not define inline type aliases or interfaces in converted helper files; import from `src/types/`.

Manual test flow to report:

- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
