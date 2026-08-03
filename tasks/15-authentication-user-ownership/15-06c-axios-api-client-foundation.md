# 15-06C — Axios API Client Foundation ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Introduce a small typed Axios client for app-owned API endpoints.

## Scope

- Create an API client under `src/lib/` or `src/services/`.
- Centralize base path and JSON response handling.
- Add auth token attachment helper for future authenticated endpoints.
- Add controlled error mapping for network/API failures.
- Migrate only one low-risk existing app API call if useful as a proof of
  pattern; otherwise document migration examples.

Do not replace Supabase client reads/writes with Axios.

## Acceptance Criteria

- Axios instance is configured in one place.
- Request/response boundaries still validate unknown responses with Zod where
  data enters domain code.
- Auth token attachment does not assume a session exists.
- API errors map to controlled Hungarian messages.
- No endpoint path strings are newly duplicated in components.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Supabase auth/database calls still use the Supabase client.
- [ ] No secrets or service role values are used in frontend.
- [ ] Axios interceptors do not hide errors from callers.
- [ ] No broad migration of AI/editor endpoints is included.
- [ ] Runtime validation is preserved at every external boundary.
