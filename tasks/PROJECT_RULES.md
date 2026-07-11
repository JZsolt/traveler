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
- Stateful reusable logic belongs in `src/hooks/use*.ts`.
- Shared UI belongs in `src/components/` or `src/components/ui/`.
- Anything used in 2+ places must be extracted to a shared component, hook, helper, or constant.
- Target file size is about 200 lines. Hard maximum is about 250 lines unless the task documents why the file must stay larger.
- Constants, route paths, API endpoint paths, storage keys, model ids, section keys, and repeated UI copy should not be hard-coded inside component files.
- Use theme tokens and CSS variables instead of hard-coded colors, spacing, and inline styles where a token exists.
- Avoid inline `style` except for platform/browser requirements such as safe-area values or runtime-calculated values.
- Keep types/interfaces in dedicated type files, not embedded inside component files.
- Shared domain/API/editor types belong in `src/types/`.
- Do not declare inline `type` or `interface` in component, hook, page, lib, or API files.
- Never use `any`: no explicit `any`, no `as any`, no `Record<string, any>`, no `any[]`.
- Use `unknown` plus narrowing for JSON, Supabase, browser storage, and API responses.
- `Trip`, `Day`, and `ScheduleItem` must be defined exactly once in `src/types/trip.ts`; do not create duplicate `TripData`, `TripDay`, `Activity`, or equivalent domain types.

## Runtime Validation

- Every external input starts as `unknown`.
- Validate every external boundary with Zod before domain code receives data.
- Never expose raw AI, Supabase, browser storage, URL parameter, imported JSON, backup, or external API data to the domain layer.
- Runtime schemas live under `src/schemas/`.
- Schemas are the single source of truth for runtime data shapes.
- Infer TypeScript types from schemas whenever the schema owns the shape.
- Keep stable public type exports under `src/types/` where needed; do not maintain duplicate manual schema and type definitions.
- Parsing failure must produce a controlled error or documented safe fallback.
- Do not use `as` to bypass boundary validation. Remaining assertions require a concrete library or language limitation and already validated input.
- Do not log secrets, full prompts, raw personal trip data, or imported file contents.

## UI

- Do not redesign the UI unless explicitly requested.
- Keep styling consistent with the existing application.
- Prefer incremental improvements instead of rewrites.

## Design System

- Design-system primitives must be `.tsx` files and presentational only.
- Add or adjust tokens before migrating product pages.
- Keep `@fontsource-variable/geist` as the single font source unless a task explicitly changes the typography decision.
- Use `--font-sans` as the canonical font token.
- Use semantic CSS variables for color, radius, shadow, and spacing before adding one-off Tailwind values.
- Preserve shadcn semantic tokens, but do not add contradictory parallel token systems.
- Do not add new design dependencies unless the current task explicitly allows it.

## Code Quality

- Write clean, readable code.
- Reuse existing helpers whenever possible.
- Avoid code duplication.
- Handle loading and error states.
- Prefer small reusable utilities over repeated logic.
- During review, always check touched files against the architecture rules above: file size, logic/UI separation, duplication, constants, and theme token usage.
- During TypeScript review, also check for broad casts, any inline type/interface declarations outside `src/types/`, missing prop types, duplicated domain types, and any use of `any`.
- During runtime validation review, map every touched external boundary to its Zod schema and confirm raw input cannot reach domain code.

## Security

- Never expose secret API keys to the frontend.
- Read server secrets only from `process.env`.
- Never use the `VITE_` prefix for server-side secrets.

## Auth, Ownership, And Sharing

- Public routes must not load private trip data.
- Authenticated app functionality belongs under `/app/*`.
- Normal users can only access trips they own.
- Trip ownership must be enforced by Supabase RLS and server/API checks, not frontend filtering.
- Every private trip must have an authenticated `owner_id`; do not trust client-provided owner values.
- Public share links must use a separate share model and safe read-only projection.
- Do not make `trips` publicly readable to implement sharing.
- Hidden admin UI is only UX; admin backup/import must be verified server-side with authenticated admin identity.
- Admin backup access must not grant normal "edit any user's trip" UI behavior.

## Before finishing

- Run `pnpm run typecheck`.
- Run `pnpm run lint`.
- Run `pnpm run test:run`.
- Run `pnpm run build`.
- Fix all errors.
- Summarize every changed file.
- Explain any important implementation decisions.
- **Mark the task as ✅ DONE in the .md file header** (e.g. `# 06 — Polish ✅ DONE`).
- Stop and wait for approval before continuing.

## Quality Gate (Phase 13)

- Before starting a major new phase, verify clean install: `rm -rf node_modules && pnpm install --frozen-lockfile`.
- Schema and normalizer tests must pass (`pnpm run test:run`) — they guard runtime validation boundaries.
- New schemas or normalizer changes should include corresponding tests in `src/schemas/__tests__/` or `src/lib/__tests__/`.
- Design-system foundation (Phase 15, legacy `11-design-system-foundation.md`) is now unblocked and is the current phase.

## Build Log Hygiene

- Treat production build warnings as review findings, not background noise.
- Do not hide Vite chunk-size warnings by raising `chunkSizeWarningLimit` unless a task explicitly documents why splitting is not practical.
- Prefer route-level or feature-level `React.lazy()` code splitting for large page, admin, AI, editor, or backup/import flows.
- `pnpm run build` should be clean before starting visual/design-system work; any remaining warning needs a documented follow-up task.
