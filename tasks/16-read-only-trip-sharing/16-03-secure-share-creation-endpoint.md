# 16-03 — Secure Share Creation Endpoint

**Estimate:** 2-3 hours

## Goal

Create a server endpoint that generates and stores secure share tokens.

## Scope

- Owner-authenticated share creation endpoint.
- Cryptographically random token.
- Hash token before storing.
- Return raw token only once.
- Define behavior for existing active share.

## Acceptance Criteria

- Only the trip owner can create a share link.
- Token is generated server-side.
- Database stores only token hash.
- Endpoint response is Zod-validated.
- Existing share behavior is deterministic: reuse, revoke+new, or explicit
  conflict.

## Review Checklist

- [ ] No client-generated token.
- [ ] No raw token logging.
- [ ] Endpoint checks ownership server/database side.
- [ ] Response does not include private trip data.
