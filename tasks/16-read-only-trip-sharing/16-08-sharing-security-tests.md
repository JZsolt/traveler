# 16-08 — Sharing Security Tests

**Estimate:** 2-3 hours

## Goal

Verify the sharing security boundary.

## Scope

- Non-owner cannot create link.
- Revoked token fails.
- Random token fails safely.
- Public response excludes private fields.
- Anonymous user cannot mutate trip.
- Share token holder does not gain owner rights.

## Acceptance Criteria

- Automated or documented tests cover all cases above.
- Full quality gate passes.
- Any untestable Supabase dashboard configuration is documented.

## Review Checklist

- [ ] Tests do not log tokens.
- [ ] Token hash behavior is covered.
- [ ] Public projection is checked for excluded fields.
- [ ] RLS remains private for `trips`.
