# 11-08 — UI Primitives To TSX ✅ DONE

Read only:

- `src/components/ui/`
- `src/lib/utils.js` or `.ts`
- files importing changed UI primitives

Goal: convert low-level UI primitives before feature components.

Requirements:

1. Convert existing `src/components/ui/*.jsx` files to `.tsx`.
2. Type props using React types.
3. Preserve `forwardRef` behavior if present.
4. Keep className merging behavior unchanged.
5. Do not redesign styles.
6. Do not add new primitives in this task.
7. Convert `src/lib/utils.js` to `.ts` if still JavaScript.

Manual test flow to report:

- Basic pages render.
- Buttons/cards/badges still style correctly.
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
