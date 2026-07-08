# 11-06 — Admin And Trip Hooks To TypeScript ✅ DONE

Read only:

- `src/hooks/useAdmin.js`
- `src/hooks/useTripUpdater.js`
- `src/hooks/useDeleteTrip.js`
- `src/hooks/useExpandDay.js`
- `src/hooks/useCreateTripChat.js`
- `src/lib/`
- `src/types/`
- files importing changed hooks

Goal: convert high-level workflow hooks to TypeScript.

Requirements:

1. Convert listed hooks from `.js` to `.ts`.
2. Type hook inputs and return values.
3. Type AI/network response handling with `unknown` plus narrowing where practical.
4. Keep user-facing error messages unchanged.
5. Preserve loading/saving state behavior.
6. Do not move UI JSX into hooks.
7. Do not change endpoint contracts.

Manual test flow to report:

- Create-trip AI chat still renders.
- Day expansion still opens/generates when configured.
- Delete trip flow still prompts.
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
