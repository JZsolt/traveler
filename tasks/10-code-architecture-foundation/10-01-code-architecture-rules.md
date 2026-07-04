# 10-01 — Code Architecture Rules ✅ DONE

Read only:

- `CLAUDE.md`
- `AGENTS.md`
- `docs/architecture/ARCHITECTURE.md`
- `docs/design/IMPLEMENTATION_PLAN.md`
- `tasks/README.md`

Goal: document the code architecture rules before refactoring.

Requirements:

1. Add a concise code organization section to `docs/architecture/ARCHITECTURE.md`.
2. Document:
   - pages compose views
   - workflow logic belongs in custom hooks
   - shared UI belongs in components
   - repeated 2+ times means extract component/hook/helper
   - target file size ~200 lines
   - hard max ~250 lines unless justified
   - constants outside JSX
   - no hard-coded theme colors where tokens exist
   - avoid inline `style`
3. Add the same short standing-rule summary to `AGENTS.md`, `CLAUDE.md`, and `tasks/PROJECT_RULES.md`.
4. Add a short pointer in `tasks/README.md` so future tasks know these rules exist.
5. Do not change application code.

Manual test flow to report:

- Read the new architecture section.
- Confirm task README points to it.
- Run `pnpm run build`.

Do not write automated tests.
