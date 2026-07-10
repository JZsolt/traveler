# 12-03 — AI Response Validation ✅ DONE

**Estimate:** 2–3 hours

## Goal

Validate every Gemini response before API or frontend domain code uses it.

## Scope

- `src/schemas/ai.ts`
- `api/chat.ts`
- `api/plan-trip.ts`
- `api/expand-day.ts`
- `api/suggest-trip-section.ts`
- AI response guards and API response types

Do not change prompts, models, token limits, or user-visible success behavior.

## Acceptance Criteria

- Parsed Gemini JSON remains `unknown` until `safeParse`.
- Chat, generated draft, expanded day, and every suggested section have named
  response schemas.
- Invalid AI output returns the existing controlled error contract with a
  retryable flag where applicable.
- Validation errors are logged safely without full prompts, secrets, or raw
  personal trip content.
- Frontend hooks receive only validated API payloads.

## Review Checklist

- [ ] Every `JSON.parse` result is validated immediately.
- [ ] No response is trusted because TypeScript says it has a shape.
- [ ] 429 and token-limit behavior is preserved.
- [ ] Section schemas match their editor draft contracts.
- [ ] No prompt or model behavior changed.

