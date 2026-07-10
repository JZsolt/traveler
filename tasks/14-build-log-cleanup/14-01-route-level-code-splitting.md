# 14-01 — Route Level Code Splitting ✅ DONE

**Estimate:** 1-2 hours

## Goal

Split route-level page components into lazy-loaded chunks so the production
build no longer emits the large initial JS chunk warning.

## Scope

- `src/App.tsx`
- Route page imports used directly by `App`
- Shared loading fallback only if needed

Do not refactor page internals or change route behavior.

## Acceptance Criteria

- Route components are loaded with `React.lazy()` and rendered inside
  `Suspense`.
- A small, existing-style fallback is shown while a route chunk loads.
- Existing routes keep the same paths and behavior.
- Production build no longer reports the current `Some chunks are larger than
  500 kB` warning, or the remaining source of the warning is documented.
- No new dependency is added.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] No visual redesign was included.
- [ ] No business logic moved into `App.tsx`.
- [ ] Fallback is accessible and does not block navigation permanently.
- [ ] Route paths and redirects are unchanged.
- [ ] Build log is clean or remaining warning is documented.
