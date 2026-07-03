# Project Rules

These rules apply to every implementation task.

## General

- Read only the files listed in the current task.
- Implement only the requested TASK.
- Never continue to the next TASK automatically.
- Stop when the current TASK is complete.
- Prefer small, focused changes over large rewrites.
- **Never commit or push unless the user explicitly asks for it.**

## Architecture

- Do not redesign the architecture.
- Do not refactor unrelated files.
- Preserve existing functionality.
- Keep backward compatibility.
- Keep the project Vercel-compatible.
- Keep Supabase as the primary data source.
- Pages compose views only; complex workflow, persistence, validation, AI flow, and state logic belong in custom hooks or `lib/` helpers.
- Stateful reusable logic belongs in `src/hooks/use*.js`.
- Shared UI belongs in `src/components/` or `src/components/ui/`.
- Anything used in 2+ places must be extracted to a shared component, hook, helper, or constant.
- Target file size is about 200 lines. Hard maximum is about 250 lines unless the task documents why the file must stay larger.
- Constants, route paths, API endpoint paths, storage keys, model ids, section keys, and repeated UI copy should not be hard-coded inside JSX files.
- Use theme tokens and CSS variables instead of hard-coded colors, spacing, and inline styles where a token exists.
- Avoid inline `style` except for platform/browser requirements such as safe-area values or runtime-calculated values.
- When TypeScript is introduced, keep types/interfaces in dedicated type files, not embedded inside component files.

## UI

- Do not redesign the UI unless explicitly requested.
- Keep styling consistent with the existing application.
- Prefer incremental improvements instead of rewrites.

## Code Quality

- Write clean, readable code.
- Reuse existing helpers whenever possible.
- Avoid code duplication.
- Handle loading and error states.
- Prefer small reusable utilities over repeated logic.
- During review, always check touched files against the architecture rules above: file size, logic/UI separation, duplication, constants, and theme token usage.

## Security

- Never expose secret API keys to the frontend.
- Read server secrets only from `process.env`.
- Never use the `VITE_` prefix for server-side secrets.

## Before finishing

- Run `pnpm run build`.
- Fix all build errors.
- Summarize every changed file.
- Explain any important implementation decisions.
- **Mark the task as ✅ DONE in the .md file header** (e.g. `# 06 — Polish ✅ DONE`).
- Stop and wait for approval before continuing.
