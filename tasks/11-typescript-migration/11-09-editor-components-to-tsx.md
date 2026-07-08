# 11-09 — Editor Components To TSX ✅ DONE

Read only:

- `src/components/editor/`
- `src/hooks/`
- `src/types/`
- files importing changed editor components

Goal: convert shared editor components to TSX.

Requirements:

1. Convert editor components from `.jsx` to `.tsx`.
2. Type component props explicitly.
3. Type callback contracts for:
   - save
   - cancel
   - AI apply
   - array add/edit/delete/move
4. Preserve dirty cancel UI.
5. Preserve AI suggestion preview behavior.
6. Do not change editor layouts.
7. Place prop types in `src/types/editor.ts`; do not define inline component prop types.

Manual test flow to report:

- Open at least one editable section.
- Trigger dirty cancel warning.
- Apply an AI suggestion preview if endpoint is configured.
- `pnpm run typecheck`
- `pnpm run build`

Do not write automated tests.
