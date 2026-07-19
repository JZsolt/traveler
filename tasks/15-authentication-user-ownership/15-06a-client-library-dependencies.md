# 15-06A — Client Library Dependencies ✅

**Status:** DONE
**Estimate:** 1 hour

## Goal

Add the approved client foundation dependencies before more auth/data UI is
built on ad-hoc local state and fetch wrappers.

## Scope

Install:

- `react-hook-form`
- `@hookform/resolvers`
- `axios`
- `@tanstack/react-query`

Do not migrate any forms, API calls, or data fetching in this task.

## Acceptance Criteria

- Dependencies are added to `package.json` and `pnpm-lock.yaml`.
- No unused runtime code is added.
- No existing behavior changes.
- Clean install remains valid.

Required checks:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Dependencies are production dependencies, not dev dependencies, because
  they are used by runtime app code.
- [ ] No broad refactor is included.
- [ ] No form migration is included.
- [ ] No query provider is added yet.
