# 15-04 — Auth Schemas And Types ✅ DONE

**Estimate:** 1-2 hours

## Goal

Add Zod schemas and stable TypeScript types for auth and profile boundaries.

## Scope

- Login form schema
- Registration form schema
- Password reset schema
- Profile schema
- Session/user adapter schema or parser
- Auth error mapping helper

## Acceptance Criteria

- External auth data starts as `unknown` at app/API boundaries.
- UI does not depend directly on raw Supabase response shapes.
- No `any`, no inline type/interface declarations.
- Auth errors map to controlled Hungarian UI messages.

## Review Checklist

- [ ] Schemas live under `src/schemas/`.
- [ ] Public types live under `src/types/` only when needed.
- [ ] No duplicate user/profile type definitions.
- [ ] Supabase raw responses are parsed or adapted before domain use.
