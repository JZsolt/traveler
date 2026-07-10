# 13-01 — Clean Install Build Gate ✅ DONE

**Estimate:** 1 hour

## Goal

Prove that the project builds from a clean dependency install, not only from the
current local `node_modules`.

## Scope

- `package.json`
- `pnpm-lock.yaml`
- Clean-install notes in the task summary

Do not add test tooling in this task.

## Acceptance Criteria

- `zod` is confirmed under `dependencies`, not `devDependencies`.
- A clean install command succeeds with the lockfile.
- Typecheck, lint, and production build pass after the clean install.
- Existing Vite bundle-size warning is documented if still present.
- No source behavior changes are made unless required to fix clean-install
  failures.

Required checks:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Review Checklist

- [ ] `zod` remains a production dependency.
- [ ] Lockfile and package manifest agree.
- [ ] Build does not depend on undeclared packages.
- [ ] No unrelated refactor or UI change was included.
- [ ] Any warning is documented as warning, not hidden as success.

## Result

- `zod` is in `dependencies` (not devDependencies).
- `rm -rf node_modules && pnpm install --frozen-lockfile` — success (2.6s).
- `pnpm run typecheck` — pass.
- `pnpm run lint` — pass.
- `pnpm run build` — pass.
- **Known warning**: Vite chunk-size warning — single JS bundle is 687 KB (> 500 KB limit). Code-splitting is a future task, not a blocker.
- No source changes were required.
