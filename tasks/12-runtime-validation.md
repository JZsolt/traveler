# 12 — Runtime Validation & Data Boundaries

This phase introduces runtime validation for every external data boundary.
TypeScript migration is complete; this phase changes runtime safety, not UI.

## Goal

No unvalidated external value may enter Traveler domain code. Zod schemas are
the canonical runtime description of persisted and transported data.

## Mandatory Rules

- Every external value starts as `unknown`.
- Validate at the boundary before calling domain logic.
- Use Zod for AI, Supabase, storage, URL params, and imported JSON.
- Never expose raw external data to components, domain hooks, or transforms.
- Schemas live under `src/schemas/`.
- Infer public types from schemas whenever the schema owns the data shape.
- Preserve stable imports through `src/types/` re-exports where practical.
- Do not duplicate `Trip`, `Day`, `ScheduleItem`, or equivalent models.
- Do not use `any`, `as any`, double casts, or unchecked boundary casts.
- Preserve existing valid and legacy trip data unless a task explicitly
  documents a migration.
- Do not redesign UI or change AI prompts in this phase.

## Schema Ownership

```text
src/schemas/
  trip.ts       persisted Trip, Day, ScheduleItem and nested domain data
  ai.ts         AI request/response payloads
  auth.ts       admin/auth payloads and session state
  route.ts      URL and route parameter schemas
  storage.ts    browser storage and backup/import envelopes

src/types/
  trip.ts       inferred domain type exports
  api.ts        inferred API type exports plus internal compile-time types
  supabase.ts   database client types
```

Schemas own runtime shapes. `src/types/` remains the public type import layer
and may re-export `z.infer` types to avoid widespread import churn.

## Subtasks

1. `12-01-install-configure-zod.md`
2. `12-02-shared-domain-schemas.md`
3. `12-03-ai-response-validation.md`
4. `12-04-normalize-trip-integration.md`
5. `12-05-supabase-boundary-validation.md`
6. `12-06-browser-storage-validation.md`
7. `12-07-url-param-validation.md`
8. `12-08-import-export-validation.md`
9. `12-09-remove-unsafe-casts.md`
10. `12-10-runtime-validation-final-review.md`

## Workflow

Implement exactly one task from `tasks/12-runtime-validation/`, mark only that
task done, run its checks, summarize, and stop for review.

## Definition Of Done

- Every external boundary has a named Zod schema.
- Domain code receives parsed values, never raw payloads.
- Invalid data produces a controlled Hungarian error or safe fallback.
- No duplicated schema/type ownership exists.
- Typecheck, lint, build, and trip validation pass.
- Design-system implementation may start only after task 12-10 is complete.
