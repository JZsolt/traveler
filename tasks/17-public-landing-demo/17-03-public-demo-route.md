# 17-03 — Public Demo Route ✅ DONE

**Estimate:** 2-3 hours

## Goal

Create a public read-only demo trip route.

## Scope

- `/demo`
- Load selected demo data.
- Read-only presentation components.
- CTA back to landing/register.

## Acceptance Criteria

- Demo works without login.
- No edit, AI, delete, or share management appears.
- Demo data validates with schemas.
- Mobile layout works.

## Review Checklist

- [x] Does not reuse editable components with hidden controls if a read-only
  component exists — the route renders the project's existing read-only view,
  `SharedTripView`, instead of composing editable sections itself. No new
  hidden-control reuse was introduced, and no parallel demo view was duplicated.
- [x] Demo route cannot access private trips — the page makes no Supabase and no
  API call at all; its only data source is the static
  `src/data/demo/demo-trip.json` import.
- [x] Public route is not protected — `ROUTES.DEMO` sits outside `AppShell` and
  outside `ProtectedRoute`, next to `/share/:token`, so it renders without a
  session.
- [x] No admin UI is visible — the page uses the public `SharedHeader`, not the
  app `Header`; there is no owner, settings, backup, or admin control in the
  tree.

## Output

New files:

- `src/data/demo/demo-trip.json` — fictional 3-day, 2-person Vienna itinerary,
  15 schedule items, 14.5 KB (budget: 40 KB). No real people, bookings, or
  addresses; no `tickets`, `insurance`, or internal state fields.
- `src/lib/loadDemoTrip.ts` — dynamic JSON import, `unknown` ->
  `TripSchema.safeParse()` -> `projectPublicTrip()`. No new schema.
- `src/hooks/useDemoTrip.ts` — loading state for the static demo data.
- `src/pages/DemoTripPage.tsx` — composition only: `SharedHeader` +
  `ReadOnlyContext` + `SharedTripView`.
- `src/lib/demoCopy.ts` — repeated demo UI copy as constants.
- `src/lib/__tests__/demoTrip.test.ts` — guard test required by
  `DEMO_TRIP_STRATEGY.md` 7: schema parse, projection, slug, absence of
  forbidden fields, size budget, end-to-end loader run.

Changed files:

- `src/App.tsx` — lazy `/demo` route registered outside `AppShell`.
- `src/lib/constants.ts` — `ROUTES.DEMO` and `DEMO_TRIP_SLUG`.
- `src/components/shared/SharedHeader.tsx` — optional `label` prop (default
  unchanged) so the demo can label itself without duplicating the header.
- `src/components/shared/SharedTripError.tsx` — new `demo` variant, because the
  shared-link wording ("a link érvénytelen vagy lejárt") is misleading on the
  demo route. Added as a variant rather than a second component so the layout is
  not duplicated.
- `src/types/shared.ts` — `DemoTripState`, `DemoTripStatus`,
  `SharedHeaderProps`, `PublicViewErrorVariant`.
- `tsconfig.json` — `resolveJsonModule: true` (required for the JSON import).

Build result: the demo JSON and the page land in their own chunks
(`demo-trip-*.js` 10.8 KB / 4.2 KB gzip, `DemoTripPage-*.js`), so the initial
payload is unchanged and the PWA precaches both.

Quality gate: typecheck OK, lint OK, 225 tests passed (6 new demo guard tests),
build clean. Dev-server smoke test: `/demo` returns 200 and the page module
transforms cleanly.
