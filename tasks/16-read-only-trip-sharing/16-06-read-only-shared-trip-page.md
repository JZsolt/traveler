# 16-06 — Read-Only Shared Trip Page

**Estimate:** 2-3 hours

## Goal

Create `/share/:token` as a public read-only trip view.

## Scope

- Public route.
- Fetch by share token.
- Read-only trip presentation components.
- Invalid/revoked/not-found states.
- Optional CTA: create your own trip.

## Acceptance Criteria

- No edit UI appears.
- No AI actions appear.
- No delete/share management appears.
- Mobile layout works.
- Invalid or revoked link has a distinct user-friendly state.

## Review Checklist

- [ ] Does not reuse editable components with only `disabled=true`.
- [ ] No owner/admin controls are rendered.
- [ ] Public response type is used.
- [ ] Token is not stored unnecessarily.
