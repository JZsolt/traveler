# 18-10 — Email Invite Provider And Abuse Controls ✅ DONE

**Estimate:** 3-5 hours

## Goal

Add transactional email invites without turning the app into an open email spam
relay.

## Scope

- Choose provider: Resend, Postmark, or equivalent.
- Server-side email send endpoint.
- Invite email template.
- Owner auth and trip ownership checks.
- Rate limits per owner and per trip.
- Duplicate invite handling.
- Non-existing app user behavior: email sends a public/invite link only, unless
  a future dedicated claim flow is specified in a separate task.
- Abuse-safe error messages.
- Env configuration and documentation.

## Output

- Provider: Resend, dependency nélkül, server-side `fetch` hívással.
- Added migration `010_trip_invite_email_events.sql`:
  - service-role-only email invite audit/rate-limit source;
  - indexes for owner/hour, trip/day, and trip+email duplicate checks.
- Added `POST /api/send-trip-invite-email`:
  - authenticated owner-only endpoint;
  - one recipient email per request, schema-validated;
  - recent duplicate detection;
  - owner hourly and trip daily server-side rate limits;
  - public share link is reused if re-displayable, otherwise created server-side;
  - legacy non-displayable active share fails safely instead of silently rotating;
  - provider failures return a generic app error and are audit-recorded.
- Email behavior:
  - non-app email receives public read-only link only;
  - existing app email also gets a pending account invite, but the API response
    does not reveal account existence;
  - no email-only recipient row or future claim-on-signup path is created.
- Added share modal email invite form.
- Added env docs:
  - `RESEND_API_KEY`
  - `INVITE_EMAIL_FROM`
  - `APP_PUBLIC_URL`
- Added schema and endpoint tests for malformed/bulk payload rejection, provider
  config failure, ownership, duplicate, rate-limit, non-app send, existing app
  pending invite, and provider failure.

## Acceptance Criteria

- Only authenticated owners can send trip invites.
- Email sending is rate-limited.
- Invite emails contain only intended recipient/link content.
- Missing provider env fails safely.
- Non-existing app users can receive a public/invite link without account data
  leakage.
- Sending email to an address that does not belong to an app user does not
  create auto-claimable account access by email match.

## Review Checklist

- [x] Endpoint cannot send arbitrary bulk email.
- [x] Rate-limit behavior is implemented or explicitly enforced server-side.
- [x] Email provider secrets are server-only.
- [x] Email content does not expose token hash or private internals.
- [x] Email recipient rows are used only for audit/dedup unless an explicit
      account-claim flow is later added.
