# 18-13 — Live Supabase RLS Verification

**Estimate:** 1-2 hours (manual, needs a real Supabase project)

Status: open. Created by the `18-12` audit, which found that the Sharing V2
security checklist's live checks had never been executed.

## Goal

Execute the "Live Supabase RLS Checks" section of
`docs/architecture/SHARING_V2_SECURITY_CHECKLIST.md` against a real Supabase
project and record the result.

## Why this cannot be automated

The endpoint tests mock the Supabase client, so they prove the server sends the
right queries and returns the right shapes — they cannot prove that RLS policies
reject a real cross-user read. That needs two real authenticated users against a
project with migrations `006` through `010` applied.

## Scope

- Two normal users (`owner_a`, `recipient_b`) in a real Supabase project.
- The six numbered checks in the security checklist: owner trip isolation,
  public link, QR, account invite, revoke, email.
- Email checks additionally need `RESEND_API_KEY`, `INVITE_EMAIL_FROM`, and
  `APP_PUBLIC_URL` configured.

## Acceptance Criteria

- Every numbered live check is executed and its outcome recorded (pass, fail, or
  skipped with a reason).
- Any failure is filed as its own fix task before Phase 18 is considered closed.
- The checklist's "Status: not yet executed" line is replaced with the date and
  result of the run.
- No production data is used for the destructive steps (revoke, decline).

## Review Checklist

- [ ] Cross-user raw trip read was actually attempted, not assumed.
- [ ] Revoked invite verified from the recipient side, including direct URL.
- [ ] Email duplicate/rate-limit behavior observed, not inferred from code.
- [ ] Results recorded in the security checklist, not only in a commit message.
