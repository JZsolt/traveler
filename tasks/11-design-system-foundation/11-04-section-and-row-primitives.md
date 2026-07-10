# 11-04 — Section And Row Primitives ✅ DONE

Read only:

- `docs/design/COMPONENT_SPEC.md`
- `docs/design/VISUAL_LANGUAGE.md`
- `src/components/ui/`
- `src/lib/utils.ts`

Goal: add reusable content layout primitives.

Requirements:

1. Add `src/components/ui/Section.tsx`.
2. Add `src/components/ui/Row.tsx`.
3. `Section` should support:
   - title
   - optional eyebrow/label
   - optional action
   - `children`
   - `className`
4. `Row` should support:
   - optional icon
   - title
   - optional subtitle
   - optional meta/action
   - optional click/anchor behavior
5. Keep styling calm and mobile-first.
6. Do not migrate pages in this task.
7. Update `docs/design/COMPONENT_SPEC.md` statuses.

Manual test flow to report:

- Import check by running build.
- Confirm no page changed yet.
- Run `pnpm run build`.

Do not write automated tests.
