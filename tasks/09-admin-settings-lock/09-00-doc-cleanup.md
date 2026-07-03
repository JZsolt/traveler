# 09-00 — Documentation Cleanup ✅ DONE

Read only:

- `docs/design/COMPONENT_SPEC.md`
- `src/components/ui/button.jsx`
- currently modified docs

Goal: clean up documentation drift before starting admin-gate implementation.

Requirements:

1. Align `docs/design/COMPONENT_SPEC.md` with the actual `Button` API.
2. Keep existing/planned component statuses accurate.
3. Prefer references over duplicated philosophy text where another doc is the source of truth.
4. Do not change application code.

Manual test flow to report:

- Compare `COMPONENT_SPEC.md` Button variants and sizes with `src/components/ui/button.jsx`.
- Run `git diff --check`.
- Run `pnpm run build`.

Notes:

- `Button` variants now match the implementation: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`.
- `Button` sizes now match the implementation: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
