# Sharing V2 Security Checklist

## Automated Coverage

- Share token storage:
  - raw public share tokens are generated with 32 random bytes;
  - DB lookup uses `token_hash`;
  - owner re-display uses AES-256-GCM ciphertext;
  - tests do not log raw tokens.
- Public shared-trip lookup:
  - malformed/random/expired/revoked tokens all return the same 404 class;
  - response is `PublicTrip` only;
  - private fields such as tickets, insurance, and nested passthrough extras are stripped.
- Account recipient sharing:
  - owner invite requires authenticated owner trip scope;
  - accept/decline requires recipient scope and pending state;
  - revoke requires owner scope;
  - pending invites are teaser-only and do not appear in accepted shared trips;
  - accepted recipient trips are projected through `projectPublicTrip`.
- Profile QR:
  - public profile IDs are URL-safe, random, opt-in, rotatable, and disableable;
  - disabled or rotated IDs cannot create new invites;
  - QR creates pending invites only.
- Email invites:
  - one recipient per request;
  - owner/trip scoped;
  - provider secrets are server-only;
  - owner/trip rate limits and duplicate checks are server-side;
  - non-app recipients get only a public link, no claimable recipient row.

## Live Supabase RLS Checks

Run after applying migrations `006` through `010` in a real Supabase project.
Use two normal users: `owner_a` and `recipient_b`.

1. Owner trip isolation:
   - sign in as `owner_a`;
   - create or seed a trip;
   - confirm `trips` rows visible through the app belong only to `owner_a`;
   - sign in as `recipient_b`;
   - confirm `recipient_b` cannot read `owner_a` raw trip row from app-owned Supabase queries.
2. Public link:
   - as `owner_a`, create a public link;
   - open the `/share/:token` URL logged out;
   - confirm the page renders read-only and no owner edit/delete/share controls appear;
   - confirm tickets/insurance/private uploaded documents are absent.
3. QR:
   - scan or open the generated public QR URL;
   - confirm it opens the same read-only public trip as the visible link.
4. Account invite:
   - as `owner_a`, invite `recipient_b` by email or profile QR;
   - as `recipient_b`, confirm it appears under `Meghívások`, not `Megosztva velem`;
   - accept it;
   - confirm it moves to `Megosztva velem` and opens `/app/shared/:inviteId` read-only.
5. Revoke:
   - as `owner_a`, revoke the recipient invite;
   - as `recipient_b`, refresh dashboard and direct `/app/shared/:inviteId`;
   - confirm the trip disappears or redirects away.
6. Email:
   - configure `RESEND_API_KEY`, `INVITE_EMAIL_FROM`, and `APP_PUBLIC_URL`;
   - send to a non-app email and confirm only the public read-only link is received;
   - send to `recipient_b` and confirm email is sent plus a pending app invite appears;
   - repeat the same email quickly and confirm duplicate/rate-limit behavior prevents repeated sends.

## Explicit Non-Goals Verified

- Public share token holder does not receive owner auth.
- Public share token holder does not receive account-recipient access.
- DB dump of `trip_shares` without `SHARE_TOKEN_ENCRYPTION_KEY` does not reveal active URLs.
- There is no email-only, future claim-on-signup recipient row.
