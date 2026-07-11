# 15-06 — Login, Registration And Recovery UI

**Estimate:** 2-3 hours

## Goal

Create the public auth screens.

## Scope

- `/login`
- `/register`
- `/forgot-password`
- Shared auth form components where useful
- Field validation
- Loading/disabled states
- Supabase error display through auth error mapping

## Acceptance Criteria

- Screens are mobile usable.
- Forms are password-manager compatible.
- Field-level validation is visible.
- Loading and disabled states prevent duplicate submits.
- Accessibility labels and keyboard flow are correct.

## Review Checklist

- [ ] No authenticated app data loads on auth pages.
- [ ] No raw Supabase error object is rendered.
- [ ] Auth pages use design-system primitives where practical.
- [ ] No full landing redesign is included.
