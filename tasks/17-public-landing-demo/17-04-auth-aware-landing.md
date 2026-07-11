# 17-04 — Auth-Aware Landing

**Estimate:** 2-3 hours

## Goal

Make `/` a public landing that adapts to auth state.

## Scope

- Public landing page.
- Anonymous CTAs: login/register/demo.
- Authenticated CTA: open app / My Trips.
- No real trip list on `/`.
- Redirect decisions for legacy app root if needed.

## Acceptance Criteria

- Anonymous visitors see landing, not private trip dashboard.
- Logged-in users can open `/app/trips` directly from landing.
- `/` does not load private trips.
- Admin functionality is not visible.

## Review Checklist

- [ ] Landing does not fetch user trips.
- [ ] Auth loading state avoids CTA flicker.
- [ ] Route compatibility with old `/` behavior is documented.
- [ ] Design uses existing primitives and tokens.
