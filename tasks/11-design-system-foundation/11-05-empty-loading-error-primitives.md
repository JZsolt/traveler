# 11-05 — Empty, Loading And Error Primitives

Read only:

- `docs/design/COMPONENT_SPEC.md`
- `docs/design/VISUAL_LANGUAGE.md`
- `src/components/ui/`
- `src/components/DbError.tsx`
- `src/lib/utils.ts`

Goal: add small reusable state primitives without changing existing flows.

Requirements:

1. Add `src/components/ui/EmptyState.tsx`.
2. Add `src/components/ui/LoadingState.tsx`.
3. Add `src/components/ui/InlineError.tsx`.
4. Use Lucide icons only when an icon is needed.
5. Do not replace `DbError.tsx` in this task.
6. Do not migrate pages in this task.
7. Update `docs/design/COMPONENT_SPEC.md` statuses.

Manual test flow to report:

- Import check by running build.
- Confirm no page changed yet.
- Run `pnpm run build`.

Do not write automated tests.
