# 17-03 — Public Demo Route

**Estimate:** 2-3 hours

## Goal

Create a public read-only demo trip route.

## Scope

- `/demo`
- Load selected demo data.
- Read-only presentation components.
- CTA back to landing/register.

## Acceptance Criteria

- Demo works without login.
- No edit, AI, delete, or share management appears.
- Demo data validates with schemas.
- Mobile layout works.

## Review Checklist

- [ ] Does not reuse editable components with hidden controls if a read-only
  component exists.
- [ ] Demo route cannot access private trips.
- [ ] Public route is not protected.
- [ ] No admin UI is visible.
