# 16-01 — Sharing Product And Threat Model

**Estimate:** 1-2 hours

## Goal

Document the public sharing behavior and security boundary before building it.

## Scope

- Anonymous read-only access by token.
- Revocation.
- Optional expiry.
- Non-indexed by default.
- Token must not be trip id or slug.
- Public response must not contain owner/private/admin data.

## Acceptance Criteria

- Sharing spec exists under `docs/architecture/` or `docs/product/`.
- Threat model covers token guessing, revoked tokens, owner spoofing, and data
  projection leaks.
- Decision is explicit: no public `trips` table read policy.

## Review Checklist

- [ ] Public token possession grants only read-only view.
- [ ] Share does not bypass ownership for management actions.
- [ ] Projection fields are defined before endpoint work.
