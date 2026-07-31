# 18-09 — Profile QR Opt-In And Rotation ✅ DONE

**Estimate:** 2-3 hours

## Goal

Allow users to opt into a scannable profile QR for account-to-account trip
invites while preserving privacy controls.

## Scope

- Profile fields:
  - `public_share_id text unique`
  - `profile_share_enabled boolean`
  - `profile_share_rotated_at timestamptz`
- Generate/rotate public profile ID server-side.
- Disable profile QR.
- Profile QR display in settings.
- QR scanner flow or QR URL resolver.
- **Profile-QR invite resolution (moved from 18-06):** extend the
  `POST /api/trip-recipients` `invite` action to accept a scanned
  `public_share_id` (in addition to email) and resolve it to a recipient user
  **only when that user's `profile_share_enabled` is true** (and the id is
  current, i.e. not rotated away). Reuse `createPendingInvite` /
  `isPendingInviteLimitReached`; a disabled/rotated id must not create an invite.

## Output

- Added migration `009_profile_share_qr.sql`:
  - `profiles.public_share_id`
  - `profiles.profile_share_enabled`
  - `profiles.profile_share_rotated_at`
  - partial unique index and URL-safe, non-short ID format check.
- Added authenticated server endpoint `POST /api/profile-share-management`:
  - `get`, `enable`, `rotate`, `disable`
  - public profile IDs are generated server-side with 24 random bytes encoded as
    base64url.
  - rotate replaces the ID and keeps sharing enabled; disable keeps the current
    ID but makes it unusable for new invites.
- Added Settings UI for opt-in profile QR:
  - enabled/disabled state
  - QR display, copy, download
  - rotate and disable controls.
- Added `/app/profile-share/:publicShareId` QR URL resolver page. It does not
  look up or expose profile data; it only helps copy the scanned ID/URL for the
  trip share flow.
- Extended `POST /api/trip-recipients` invite action:
  - existing email invite remains supported;
  - profile QR invite accepts `publicShareId`;
  - resolver only matches `profiles.profile_share_enabled = true`;
  - unknown, disabled, or rotated IDs return `not_app_user` and create no
    recipient row.
- Added a profile QR invite form to the trip share modal. It accepts either the
  scanned QR URL or the raw public ID and creates only a pending invite.
- Added schema and endpoint tests for profile share management and QR-based
  recipient invite behavior.

## Acceptance Criteria

- Profile QR is opt-in, not enabled by default.
- QR does not expose email.
- User can disable profile QR.
- User can rotate profile QR, invalidating the old target ID.
- Disabled/rotated QR cannot create new invites.

## Review Checklist

- [x] Public profile ID is not guessable.
- [x] QR scan can only create pending invites.
- [x] No automatic accepted recipient access from QR alone.
- [x] Settings UI explains enabled/disabled state clearly.
