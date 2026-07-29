# 16-03 — Secure Share Creation Endpoint — DONE

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

- [x] No client-generated token.
- [x] No raw token logging.
- [x] Endpoint checks ownership server/database side.
- [x] Response does not include private trip data.

## Output

- Added `POST /api/create-trip-share`.
- Added server-side bearer-token validation with a Supabase service-role client.
- Validated request and response payloads with Zod sharing schemas.
- Generated the raw share token server-side with cryptographic randomness and stored only a SHA-256 hash.
- Checked trip ownership on the server before creating a share row.
- Used explicit `409 ACTIVE_SHARE_EXISTS` behavior when an active, unrevoked, unexpired share already exists.
