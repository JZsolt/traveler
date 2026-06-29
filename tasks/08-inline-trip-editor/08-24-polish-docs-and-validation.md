# 08-24 — Polish, Validation And Docs

Read only:

- files changed in this phase
- `src/lib/validateTripJson.js`
- `CLAUDE.md`
- `AGENTS.md`
- `tasks/README.md`
- `tasks/08-inline-trip-editor.md`

Goal: final pass after all editor/AI tasks.

Requirements:

1. Add `src/lib/validateTripSection.js` if section validators are duplicated.
2. Validate only edited sections, not whole legacy trips.
3. Block invalid saves with UI errors.
4. Add dirty-state protection:
   - Cancel with unsaved changes asks confirmation.
   - Switching edit sections with unsaved changes asks confirmation or is blocked.
5. iPhone 12 mini width: no horizontal overflow.
6. Icon-only buttons have `aria-label`.
7. Long text uses textarea.
8. Large nested editors use collapsible sections.
9. Docs explain:
   - shared updater hook
   - editable section shell
   - AI preview/apply/save flow
   - AI never auto-saves
   - AI errors are user-facing
10. Docs use `pnpm run build`.
11. Do not add new features.

Manual test flow to report:

- One manual edit in each section type.
- One AI suggestion happy path.
- One AI error path.
- Dirty cancel prompt.
- Mobile no-overflow spot check.
- Build passes.

Do not write automated tests.
Run `pnpm run build`.
