# 11-11 — Create Trip Page Shell Migration

Read only:

- `docs/design/VISUAL_LANGUAGE.md`
- `docs/product/SCREEN_LIBRARY.md`
- `src/pages/CreateTripPage.tsx`
- `src/components/ui/`

Goal: migrate the Create Trip page shell to a calmer design-system layout.

Requirements:

1. Use `Page`, `PageHeader`, `Section`, and `Row` where appropriate.
2. Preserve all trip generation behavior.
3. Preserve AI chat/generation API calls.
4. Preserve validation and save behavior.
5. Keep one clear primary action per visible step.
6. Do not change generated trip schema.
7. Update `docs/design/IMPLEMENTATION_PLAN.md` Phase 7 status when complete.

Manual test flow to report:

- Open create trip flow.
- Fill basic prompt/input.
- Generate or describe the generation path if env is unavailable.
- Save behavior remains unchanged.
- Mobile width has no horizontal overflow.
- Run `pnpm run build`.

Do not write automated tests.
