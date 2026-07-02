# Claude Prompts

## First prompt

Read all files in docs/design.

Implement Phase 1 and Phase 2 from docs/design/IMPLEMENTATION_PLAN.md only.

Rules:
- Do not redesign pages yet.
- Do not change app behavior.
- Do not add new dependencies.
- Stop after completion and summarize changed files.

## Primitive prompt

Read docs/design/COMPONENT_SPEC.md and docs/design/IMPLEMENTATION_PLAN.md.

Implement Phase 3 only.

Rules:
- Create simple reusable primitives in src/components/ui.
- Use existing Tailwind setup.
- Use CSS variables where possible.
- Do not migrate pages.
- Do not add unrelated refactors.
- Stop after completion.

## Design system route prompt

Implement Phase 4 only.

Create /design-system route showing all UI primitives.

Rules:
- This page is for development reference.
- Do not touch production pages except route registration.
- Stop after completion.

## Trip overview migration prompt

Implement Phase 5 only.

Migrate the Trip overview page to the new Traveler visual language.

Rules:
- Use primitives from src/components/ui.
- Use Timeline for today/current day schedule.
- Use Row for trip blocks.
- Use AI assist as a subtle secondary action.
- Do not redesign other pages.
- Do not change data shape.
- Do not change Supabase logic.
- Stop after completion.

## Review prompt for Codex

Review this implementation against docs/design.

Focus on:
- visual consistency
- component reuse
- Tailwind/design token usage
- no random one-off styles
- mobile usability
- accessibility basics
- unnecessary changes

Return only actionable issues.
