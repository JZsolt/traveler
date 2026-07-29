# 15-06D — TanStack Query Provider Foundation ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Add TanStack Query as the standard server-state cache layer without migrating
all app data fetching at once.

## Scope

- Create `QueryClient` configuration.
- Add `QueryClientProvider` in the app provider tree.
- Define initial query key conventions under `src/lib/` or `src/types/`.
- Add cache clear behavior on logout if possible without coupling providers
  incorrectly.
- Migrate at most one low-risk auth/profile query, or document migration
  target for 15-10.

## Acceptance Criteria

- Query provider is installed once at the app root.
- Query keys are centralized and typed.
- Auth logout has a clear cache invalidation strategy.
- No full `TripsContext` rewrite happens in this task.
- 15-10 remains responsible for user-scoped trip data migration.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Provider order is intentional and documented.
- [ ] Query cache does not leak User A data into User B session.
- [ ] No public routes preload private trip data.
- [ ] Mutations have explicit invalidation plans.
- [ ] Devtools are not added unless explicitly justified.
