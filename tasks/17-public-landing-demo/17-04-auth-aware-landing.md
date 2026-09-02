# 17-04 — Auth-Aware Landing ✅ DONE

**Estimate:** 2-3 hours

## Goal

Make `/` a public landing for anonymous visitors while sending authenticated
visitors directly to their trip dashboard.

## Scope

- Public landing page.
- Anonymous CTAs: login/register/demo.
- Authenticated root visit: redirect to app / My Trips.
- No real trip list on `/`.
- Redirect decisions for legacy app root if needed.

## Acceptance Criteria

- Anonymous visitors see landing, not private trip dashboard.
- Logged-in users who open `/` are redirected to `/app/trips`.
- `/` does not load private trips.
- Admin functionality is not visible.

## Review Checklist

- [x] Landing does not fetch user trips — `/` is registered outside `AppShell`
  and wrapped in `PublicOnlyRoute`, so `TripsProvider` never mounts while the
  auth decision is made. Anonymous visitors then see the landing; authenticated
  visitors are redirected to `/app/trips`.
- [x] Auth loading state avoids CTA flicker — `PublicOnlyRoute` renders the
  existing auth loading state while the session resolves, so signed-in users do
  not briefly see anonymous landing CTAs.
- [x] Route compatibility with old `/` behavior is documented — see the Output
  section below and `docs/product/LANDING_IA.md` 2 and 5.
- [x] Design uses existing primitives and tokens — `Page`, `Card`,
  `LoadingState`, `SharedHeader`, and semantic tokens (`bg-primary`,
  `text-muted-foreground`, `ring-foreground/10`); no new hard-coded colors and
  no new dependencies.


## Output

New files:

- `src/pages/LandingPage.tsx` — composition only (28 lines).
- `src/components/landing/` — `LandingHero`, `LandingHowItWorks`,
  `LandingValue`, `LandingDemoPreview`, `LandingClosing`, `LandingFooter`,
  `LandingHeaderCta`, and the shared `LandingCta` link.
- `src/lib/landingCta.ts` — pure `resolveLandingCta(hasUser, isLoading)`
  decision function.
- `src/hooks/useLandingCta.ts` — thin wrapper reading only the auth session.
- `src/lib/landingCopy.ts` — all landing copy as constants.
- `src/types/landing.ts` — landing types.
- `src/lib/__tests__/landingCta.test.ts` — 4 tests covering the loading,
  anonymous, and authenticated CTA states.

Changed files:

- `src/App.tsx` — `/` now renders the lazy `LandingPage` outside `AppShell` and
  behind `PublicOnlyRoute`; anonymous users see landing, signed-in users redirect
  to `/app/trips`.
- `src/components/shared/SharedHeader.tsx` — optional `trailing` slot so the
  landing can put its CTA in the public brand bar without duplicating it.
- `src/components/Header.tsx` — the app header's brand link is now auth-aware
  (`/app/trips` when signed in, `/` otherwise) and uses `ROUTES` constants.
- `src/types/shared.ts` — `SharedHeaderProps.trailing`.

### Route compatibility with the old `/` behavior

Before Phase 17: `/` rendered inside `AppShell` and immediately redirected to
`/app/trips`, so an anonymous visitor was bounced to `/login`.

After: `/` is the public landing entry point for anonymous visitors only.
Authenticated visitors are gated by `PublicOnlyRoute` and redirected to
`/app/trips`, because the dashboard is the useful signed-in home. This matches
`LANDING_IA.md` 5.

Unchanged: every `/app/*` route keeps its `ProtectedRoute` behavior, the
`PublicOnlyRoute` redirect target stays `/app/trips`, and the legacy redirects
(`/trip/:slug`, `/create-trip`, `/settings`) are untouched. The app header's
brand link was repointed so signed-in users are not sent out of the app by it.

Quality gate: typecheck OK, lint OK, 229 tests passed, build clean
(`LandingPage-*.js` 7.3 KB / 2.5 KB gzip, own chunk). Dev-server smoke test: `/`
and `/demo` both return 200 and their modules transform cleanly.
