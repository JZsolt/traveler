# 20-07 — Trip Runtime Cache Foundation

**Estimate:** TBD after 20-06

## Goal

Implement the first local runtime cache for critical trip data needed during
travel.

## Scope

- Cache only validated trip runtime data.
- Store days, schedule, addresses, guide text, ticket metadata, booking metadata,
  and key links required by the live/offline experience.
- Do not cache secrets or raw AI/Supabase responses.

## Acceptance Criteria

- Browser storage boundaries use `unknown` plus Zod parsing.
- Cache keys are centralized.
- Failure falls back safely to online/current data.
- Full quality gate passes.

## Output

Pending.

