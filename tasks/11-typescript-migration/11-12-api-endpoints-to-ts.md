# 11-12 — API Endpoints To TypeScript ✅ DONE

Read only:

- `api/`
- `src/types/api.ts`
- `package.json`
- `vercel.json` if present
- Vercel build-related config files

Goal: type serverless API endpoints while keeping Vercel behavior.

Requirements:

1. Confirm Vercel supports the planned endpoint file extension before renaming.
2. If safe, convert API files from `.js` to `.ts`.
3. If endpoint `.ts` is risky for this project, keep runtime files `.js` and add JSDoc type boundaries instead; document why.
4. Type request bodies and response payloads.
5. Type shared admin auth helper.
6. Type Gemini response parsing with `unknown` + validation/narrowing.
7. Do not use `any` for request, response, or Gemini data.
8. Do not define inline API types in endpoint files; import from `src/types/api.ts`.
9. Do not expose server secrets to frontend types or `VITE_*`.
10. Preserve endpoint names and contracts.

Manual test flow to report:

- `pnpm run typecheck`
- `pnpm run build`
- Manually verify endpoint filenames still match frontend fetch paths.

Do not write automated tests unless the endpoint conversion requires a small parser unit test.
