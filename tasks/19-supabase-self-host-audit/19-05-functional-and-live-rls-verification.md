# 19-05 — Functional And Live RLS Verification On Self-Host

**Estimate:** 2-4 hours

## Goal

Exercise the full application against the restored self-host copy, and close the
pending `18-13` live RLS verification on this stack rather than on managed.

This is migration sequence steps 7-8 from the audit.

## Context

`18-13` (live RLS verification with two real users) is still open from Phase 18.
Running it against managed now would mean running it twice, because it would
have to be repeated on the self-host stack anyway.

## Scope

Point a local build at the self-host stack using its new keys, carrying
`SHARE_TOKEN_ENCRYPTION_KEY` across unchanged.

Exercise:

- signup, email confirmation, login, password reset
- trip create, edit, delete
- public share link from an anonymous browser session
- account-to-account invite: send, accept, decline, revoke
- profile QR share
- admin backup and import

Then run the `18-13` procedure with two real users.

## Acceptance Criteria

- Every listed flow works against the self-host stack.
- Existing share links still resolve, proving the encryption key carried over.
- `18-13` passes: no cross-user read is possible.
- GoTrue SMTP is configured and confirmation/reset mail actually arrives.
- Findings are recorded even where they block cutover.

## Output

Pending.
