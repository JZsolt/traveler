# 18-08 — Dashboard Shared-With-Me And Invites ✅ DONE

**Estimate:** 3-4 hours

## Goal

Add dashboard UX for own trips, accepted shared-with-me trips, and pending
invites.

## Scope

- Dashboard tabs / segmented control:
  - `Saját utazásaim`
  - `Megosztva velem`
  - `Meghívások`
- Accepted shared trips list.
- Pending invite accept/decline UI.
- Shared-with-me badge.
- Read-only navigation for accepted shared trips.
- Loading/error/empty states.

## Output

- Added `useSharedWithMe()` for `/api/shared-with-me` loading, validation, refresh,
  and accept/decline actions through `/api/trip-recipients`.
- Split the dashboard into reusable sections:
  - owned trips stay in the existing owner trip state;
  - accepted shared trips use the recipient projection response;
  - pending invites remain separate until accepted.
- Added `/app/shared/:inviteId` as an authenticated read-only recipient route.
  The route uses `SharedTripView` under `ReadOnlyContext`, so owner edit/share/delete
  controls stay hidden.
- Updated the shared-with-me response shape to return accepted trips as
  `{ inviteId, trip: PublicTrip }`, giving the client a stable recipient invite id
  for navigation instead of relying on trip slug uniqueness.
- Added schema and endpoint test coverage for the invite-bound response shape and
  private-field projection.

## Acceptance Criteria

- Pending invites do not appear in accepted shared trips.
- Accepted shared trips open read-only.
- Owner-only edit/delete/share controls do not appear for recipient trips.
- Revoke removes or disables recipient access.
- Mobile dashboard remains usable.

## Review Checklist

- [x] Recipient trips do not use editable components without read-only context.
- [x] Dashboard does not merge recipient trips into owned trip state.
- [x] Empty/error states are clear.
- [x] No public table access is required.
