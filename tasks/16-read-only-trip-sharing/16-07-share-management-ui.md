# 16-07 — Share Management UI

**Estimate:** 2-3 hours

## Goal

Allow a trip owner to manage share links from the app.

## Scope

- Trip action menu.
- Share trip.
- Copy link.
- Disable sharing.
- Generate new link.
- Shared/private badge on My Trips.

## Acceptance Criteria

- Only owner sees share management.
- Copy link works after token creation.
- Disable sharing revokes the active link.
- Generate new link invalidates or supersedes old link according to spec.
- Dashboard shows shared/private state.

## Review Checklist

- [ ] No raw token is fetched again after initial creation unless newly generated.
- [ ] Non-owner UI cannot trigger share endpoint successfully.
- [ ] Loading/error states are clear.
- [ ] Shared state does not require public trip table access.
