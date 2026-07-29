# 16-07 — Share Management UI — DONE

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

- [x] No raw token is fetched again after initial creation unless newly generated.
- [x] Non-owner UI cannot trigger share endpoint successfully.
- [x] Loading/error states are clear.
- [x] Shared state does not require public trip table access.

## Output

- `ShareManager` modal (opened from a new Share2 action button on `TripPage`,
  owner-only since it lives in the authenticated app). States: no share →
  create; just created → show link + copy; active-from-earlier → cannot re-show
  the link, offer "generate new" (revokes old) or "disable".
- `useTripSharing({ slug })` hook:
  - resolves the trip's DB id from slug (owner-scoped, RLS) — no `TripsContext`
    change;
  - `createLink` / `regenerate` call the server endpoint `POST
    /api/create-trip-share` (token generated server-side, returned once);
  - `disable` / revoke-before-regenerate run client-side via the RLS-protected
    `trip_shares` table (owner update policy);
  - raw token is held in memory only and never re-fetched (DB stores only the
    hash) — matches the checklist.
  - errors: axios → `mapApiError` (server's Hungarian message, e.g. 409), else
    `friendlyError`.
- `useSharedSlugs()` hook: owner-scoped `trip_shares` → `trips(slug)` join,
  returns the set of slugs with an active (non-revoked, non-expired) share.
  `HomePage` shows a "Megosztva" badge on those cards. Uses the owner's
  authenticated access, **not** public trip table access.
- Boundary validation: new Zod schemas `ActiveShareSchema`, `SharedSlugRowSchema`
  (offset datetimes); every Supabase/API result validated before use.
- Both new hooks keep `setState` out of the effect body
  (`react-hooks/set-state-in-effect`): async IIFE / `queueMicrotask` per the
  repo's `TripsContext` pattern.
- Verified: `pnpm run lint` clean, `tsc --noEmit` 0, `pnpm build`, 140 tests,
  dev boots clean. NOTE: the live create/copy/revoke round-trip was not driven
  end-to-end (needs Supabase + `vercel dev`); logic verified by compile + review.
