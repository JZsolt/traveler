# 13-02 — Test Framework Setup

**Estimate:** 1-2 hours

## Goal

Add minimal unit-test tooling for schema and normalizer tests.

## Scope

- `package.json`
- `pnpm-lock.yaml`
- Test configuration file if needed
- Empty or smoke test only if required to prove setup

Prefer Vitest because the app already uses Vite.

## Acceptance Criteria

- Test runner dependency is added as a dev dependency.
- `package.json` has a deterministic CI-style script, for example
  `test:run`.
- Test setup does not require browser, Supabase, Vercel, or network access.
- TypeScript test files are supported.
- Existing app build behavior is unchanged.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Test dependency is dev-only.
- [ ] Test command exits non-interactively.
- [ ] No snapshot-heavy or UI browser test setup was introduced.
- [ ] No `any` or inline app/API/lib type definitions were introduced.
- [ ] Tests can run without env secrets.
