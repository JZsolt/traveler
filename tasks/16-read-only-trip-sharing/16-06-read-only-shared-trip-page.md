# 16-06 — Read-Only Shared Trip Page — DONE

**Estimate:** 2-3 hours

## Goal

Create `/share/:token` as a public read-only trip view.

## Scope

- Public route.
- Fetch by share token.
- Read-only trip presentation components.
- Invalid/revoked/not-found states.
- Optional CTA: create your own trip.

## Acceptance Criteria

- No edit UI appears.
- No AI actions appear.
- No delete/share management appears.
- Mobile layout works.
- Invalid or revoked link has a distinct user-friendly state.

## Review Checklist

- [x] Does not reuse editable components with only `disabled=true`.
- [x] No owner/admin controls are rendered.
- [x] Public response type is used.
- [x] Token is not stored unnecessarily.

## Output

- Added public route `/share/:token` (outside `ProtectedRoute`) → lazy
  `SharedTripPage`.
- `useSharedTrip(token)` hook: POSTs `{ token }` to `/api/shared-trip`, validates
  the response with `PublicSharedTripResponseSchema`; exposes
  `loading | ok | notfound | error`. Token is not persisted anywhere.
- **Reuse approach (per owner request):** instead of building parallel read-only
  components, added a `ReadOnlyContext` (default `false`). `SharedTripPage` wraps
  the tree in `value={true}` and the existing section components hide their own
  edit UI via `useReadOnly()`. This is a real read-only mode (edit UI is
  **removed**, not `disabled`), satisfying the checklist while staying DRY.
- Guards added: `EditableSection` (covers all 5 list sections at once),
  `DayHeader`, `DaySchedule`, `DayAdvancedDataEditor`, `BudgetSummary`, and
  `ScheduleItem` (now also honors the context). Owner-only actions (delete,
  export, add-day, AI expand) simply aren't rendered by `SharedTripView`.
- Distinct friendly states: `SharedTripError` for `notfound` (invalid / expired /
  revoked) vs `error` (server/network); optional "create your own trip" CTA.
- `PublicTrip` is structurally assignable to `Trip`, so the reused components
  accept it with no cast.
- **Public/protected shell split (review fix):** `TripsProvider` + app `Header`
  now run only under an `AppShell` layout route wrapping every non-share route.
  `/share/:token` sits outside it, so a logged-in visitor triggers **no private
  trip fetch** (`TripsContext` is keyed on `owner_id = userId`) and the app
  `Header` (with its Settings/owner link) never renders on the share page.
- Added `SharedHeader`: a public brand-only bar (no settings, no app nav, no
  trip breadcrumb), same height as the app header so `Page`'s reserved top
  padding still fits.
- **Lint fix:** `useSharedTrip` no longer calls `setState` synchronously in the
  effect body (`react-hooks/set-state-in-effect`); all state transitions happen
  inside the async callback, with a lazy initial state for the no-token case.
- Verified: `pnpm run lint` clean, `tsc --noEmit` 0, `pnpm build` (incl. new
  lazy chunk), 140 tests, dev server boots clean and both `/share/:token` and
  `/app/trips` serve. NOTE: the full happy-path (a real shared trip rendered
  read-only) was not driven end-to-end here — it needs Supabase + the Vercel API
  running locally (`vercel dev`), which isn't configured in this environment.
