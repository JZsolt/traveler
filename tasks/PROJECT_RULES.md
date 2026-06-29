# Project Rules

These rules apply to every implementation task.

## General

- Read only the files listed in the current task.
- Implement only the requested TASK.
- Never continue to the next TASK automatically.
- Stop when the current TASK is complete.
- Prefer small, focused changes over large rewrites.

## Architecture

- Do not redesign the architecture.
- Do not refactor unrelated files.
- Preserve existing functionality.
- Keep backward compatibility.
- Keep the project Vercel-compatible.
- Keep Supabase as the primary data source.

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
