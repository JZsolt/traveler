# 11-05 — Supabase And Context Types ✅ DONE

Read only:

- `src/lib/supabase.js`
- `src/context/`
- `src/hooks/useAdmin.js`
- `src/hooks/useTripUpdater.js`
- `src/types/`
- files importing changed context modules

Goal: type the app's persistence and context boundaries.

Requirements:

1. Convert `src/lib/supabase.js` to `.ts`.
2. Add a minimal Supabase row type for trips.
3. Convert admin context files to TypeScript/TSX:
   - `adminContextValue.js`
   - `AdminContext.jsx`
4. Keep the fast-refresh rule satisfied: component files export components only.
5. Convert `useAdmin.js` only if needed for the context type boundary.
6. Type `useTripUpdater` return shape if touched.
7. Preserve sessionStorage behavior.

Manual test flow to report:

- Unlock admin in Settings.
- Confirm trip editor controls still appear when unlocked.
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
