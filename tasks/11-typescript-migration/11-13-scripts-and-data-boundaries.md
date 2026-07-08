# 11-13 — Scripts And Data Boundaries

Read only:

- `scripts/`
- `src/data/`
- `src/lib/validateTripJson.*`
- `src/types/`
- `package.json`

Goal: type validation/data boundaries without destabilizing trip content.

Requirements:

1. Keep trip JSON files as JSON.
2. Convert validation helpers to TypeScript only if compatible with existing scripts.
3. Type `validateTripJson` result objects.
4. Type trip normalization inputs as `unknown` where data comes from JSON/import/Supabase.
5. Do not rewrite existing trip data.
6. Do not enforce strict content validation beyond existing behavior.
7. Preserve `pnpm run validate:trips` and `pnpm run validate:trips:strict`.

Manual test flow to report:

- `pnpm run validate:trips`
- `node -c src/data/trips.js` if that file still exists as JS
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
