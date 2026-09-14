# 20-01 — Design Lab Parity And Productization Audit ✅ DONE

**Estimate:** 1-2 hours

## Goal

Compare the current production app against the prepared design lab and produce a
concrete, implementation-ready gap list for the next design/productization pass.

This task must not redesign or rewrite the app. It should identify what already
exists, what should be preserved, what needs polish, and which small tasks should
come first.

## Context

The design foundation phase is already complete. The app already has:

- Traveler design documentation;
- CSS/theme tokens;
- shared UI primitives;
- migrated production foundations for dashboard, trip overview, day timeline,
  and create trip;
- auth-aware landing and dashboard routing;
- sharing foundations;
- AI preview/apply/save behavior;
- schedule and ticket display foundations.

The design lab provides visual and UX references under:

- `prototypes/utazasaim-design-lab/dashboard.html`
- `prototypes/utazasaim-design-lab/trip-detail.html`
- `prototypes/utazasaim-design-lab/create-trip.html`
- `prototypes/utazasaim-design-lab/landing.html`
- `prototypes/utazasaim-design-lab/login.html`
- `prototypes/utazasaim-design-lab/design-system.html`

## Scope

Audit these production areas:

- Dashboard / My Trips
- Trip detail
- Day schedule / timeline
- Create trip flow
- Shared trip views
- Landing/auth boundary
- Ticket/document display
- AI action surfaces
- Offline/live-mode readiness
- Legacy style debt

## Required Reads

- `tasks/PROJECT_RULES.md`
- `docs/design/VISUAL_LANGUAGE.md`
- `docs/design/COMPONENT_SPEC.md`
- `docs/design/IMPLEMENTATION_PLAN.md`
- `docs/product/UX_RULES.md`
- `prototypes/utazasaim-design-lab/ROADMAP.md`
- relevant production files only after identifying the screen being audited

## Deliverable

Create an audit report in this task file under `## Output`.

The report must include:

- production screen inventory;
- matching design lab references;
- gap table by screen;
- what should be preserved;
- what should be changed;
- what should explicitly not be rebuilt;
- first three recommended implementation subtasks;
- quality gate recommendation for the next implementation task.

## Acceptance Criteria

- The audit distinguishes polish from rewrite.
- Existing working flows are explicitly preserved unless a concrete issue is
  documented.
- The first three follow-up tasks are small enough to review independently.
- Design changes reference existing tokens/primitives where possible.
- Any new component or hook proposal follows the project architecture rules.
- No code implementation is performed in this task.
- Runtime commands are skipped with explanation, because this is a documentation
  audit only.

## Review Checklist

- [ ] No broad rewrite recommended without concrete evidence.
- [ ] Pages remain route-level composition only.
- [ ] Shared UI/component opportunities are identified.
- [ ] Hard-coded style debt is listed separately from UX structure changes.
- [ ] AI chat surfaces are reviewed against the product rule: chat is not the
      main product.
- [ ] Live mode is scoped time-based first, GPS later.
- [ ] Offline requirements focus on critical trip runtime data.

## Output

Audit date: 2026-09-07. Documentation only, no code was changed.

### Production Screen Inventory

Routing is defined in `src/App.tsx`; all pages are lazy-loaded.

| Area | Route | Entry file | Lines |
| --- | --- | --- | --- |
| Landing (public) | `/` | `src/pages/LandingPage.tsx` | 31 |
| Login / Register / Forgot / Reset | `/login` … | `src/pages/LoginPage.tsx` + 3 | 85–105 |
| Dashboard / My Trips | `/app/trips` | `src/pages/HomePage.tsx` | 88 |
| Trip detail | `/app/trips/:slug` | `src/pages/TripPage.tsx` | 191 |
| Day schedule / timeline | inside trip detail | `src/components/day/DaySchedule.tsx` | — |
| Create trip | `/app/trips/new` | `src/pages/CreateTripPage.tsx` | 140 |
| Create trip AI chat step | inside create flow | `src/pages/CreateTripChatStep.tsx` | 134 |
| Edit trip | `/app/trips/:slug/edit` | `src/pages/EditTripPage.tsx` | 27 |
| Public share view | `/share/:token` | `src/pages/SharedTripPage.tsx` | 43 |
| Shared-with-me view | `/app/shared/:inviteId` | `src/pages/SharedWithMeTripPage.tsx` | 46 |
| Demo trip (public) | `/demo` | `src/pages/DemoTripPage.tsx` | 42 |
| Settings | `/app/settings` | `src/pages/SettingsPage.tsx` | 85 |
| Admin backup/import | `/app/internal/backup` | `src/pages/AdminBackupPage.tsx` | 78 |
| Design system reference | `/design-system` | `src/pages/DesignSystemPage.tsx` | 139 |

All page files are within the 200-line target. No page currently violates the
file-size rule, so no page split is needed for size reasons alone.

### Design Lab Reference Map

The lab contains 7 screens under `prototypes/utazasaim-design-lab/`.

| Production area | Lab reference | Status |
| --- | --- | --- |
| Dashboard | `dashboard.html` | Reference exists, production diverges |
| Trip detail | `trip-detail.html` (761 lines, richest screen) | Reference exists, production diverges |
| Create trip | `create-trip.html` (451 lines) | Reference exists, production diverges |
| Landing | `landing.html` | Reference exists |
| Login | `login.html` | Reference exists |
| Design system | `design-system.html` | Reference exists |
| Day detail timeline | — | **No lab screen** (roadmap backlog only) |
| Edit trip | — | **No lab screen** |
| AI editor / suggestion | — | **No lab screen** |
| Settings | — | **No lab screen** |
| Shared / demo view | — | **No lab screen** |
| Offline / error / sync states | — | **No lab screen** |

Conclusion: lab coverage is roughly 45%. Five audited production areas have no
visual reference at all, so "design lab parity" cannot mean "migrate every
screen". Parity work must be scoped to the five screens that actually have a
reference; the rest should follow the token/primitive system instead.

### Gap Table By Screen

| Screen | Gap | Evidence | Type |
| --- | --- | --- | --- |
| Dashboard | Lab cards use photographic category media with a dark scrim; production uses a flat navy gradient with a large emoji | `dashboard.html` `.trip-card__media` + `assets/categories/*.png` vs `src/components/trip/OwnedTripCard.tsx:16-36` | Structure + data |
| Dashboard | No trip-level category or cover image field exists, so the lab card cannot be built as designed | `src/schemas/trip.ts:180-206` has no `category`/`coverImage` | **Data model blocker** |
| Dashboard | Lab has a bottom tab bar with a centre FAB; production has a fixed dark top header only | `dashboard.html` `nav.tabbar` vs `src/components/Header.tsx:22-45` | Navigation decision |
| Dashboard | Status chips are hard-coded legacy colors, plus `animate-pulse` on two states | `OwnedTripCard.tsx:22-30` | Style debt |
| Global | Brand mark is the ✈️ emoji although a logo asset exists in the lab | `Header.tsx:29` vs `assets/utazasaim-logo.svg` | Polish |
| Global | 118 legacy hex color occurrences across 28 files, well beyond the 4 places recorded in the design plan | `grep '#0f3460\|#1a1a2e\|#e94560\|#d63d56\|#16213e' src/` | Style debt |
| Global | PWA manifest `theme_color`/`background_color` still `#1a1a2e` | `vite.config.js:87-88` | Style debt |
| Global | Several UI strings lost their Hungarian accents | `HomePage.tsx:33,40,41,51` (`Betoltes`, `Az Utazasaim`, `kirandulasom`, `Uj utazas`) | Copy defect |
| Primitives | `Section` and `Row` are used **only** in `DesignSystemPage`; zero product adoption | `grep "components/ui/Section"` → 1 file | Adoption gap |
| Primitives | `Timeline` used in 1 real screen, `PageHeader` in 2 real screens | `DaySchedule.tsx`, `HomePage.tsx`, `CreateTripPage.tsx` | Adoption gap |
| Primitives | `HeroTitle` is the only primitive still marked Planned; trip hero is bespoke | `COMPONENT_SPEC.md` + `src/components/trip/TripHero.tsx` | Missing primitive |
| Trip detail | Hero overlay buttons and section editors carry legacy colors | `TripHero.tsx` (6), `TripPage.tsx` (7) | Style debt |
| Day timeline | `DayHeader` gradient is hard-coded legacy navy | `src/components/day/DayHeader.tsx` (5) | Style debt |
| Create trip | Heaviest legacy-color file in the app | `CreateTripChatStep.tsx` (17), `CreateTripPage.tsx` (10) | Style debt |
| AI surfaces | AI is correctly secondary and never auto-saves; the create flow is the one place where chat is close to being the primary interface | `CreateTripChatStep.tsx`, `AiSuggestionPanel.tsx` | Product rule check |
| Tickets | Tickets are static PDFs committed to `public/tickets/`; there is no per-user document model | `public/tickets/*.pdf`, `src/components/day/DayTickets.tsx` | **Data model blocker** |
| Offline | Workbox runtime caching covers Wikimedia and Google Fonts, but **not Supabase**, the only trip data source | `vite.config.js:98-122` | **Offline blocker** |
| Offline | Google Fonts caching rules are dead config — Geist is bundled via `@fontsource-variable/geist` | `vite.config.js:110-121` | Dead config |
| Live mode | The only time-awareness in the app is trip-level (`upcoming`/`current`/`past`); no day-level or schedule-item-level "now" logic exists | `src/lib/getTripStatus.ts` | Foundation gap |
| Shared views | Share, shared-with-me and demo already reuse one read-only tree | `SharedTripView` + `ReadOnlyContext` | **Healthy, preserve** |

### What Should Be Preserved

These work and must not be touched by the design pass:

- Route structure and the public/private boundary in `src/App.tsx` — the public
  `/share` and `/demo` routes deliberately run outside `TripsProvider` and the
  app `Header`.
- `ReadOnlyContext` + `SharedTripView`: one component tree serves owner, shared
  and demo views. This is exactly the reuse the architecture rules ask for.
- The AI preview → apply → manual save flow. AI never auto-saves; keep it.
- `EditableSection` / `AiSuggestionPanel` as the single editing shell.
- Zod boundary validation in `src/schemas/` and `normalizeTrip.ts`.
- Lazy route loading and the existing `Page` / `LoadingState` / `InlineError`
  adoption (14–17 files each) — that migration already succeeded.
- Safe-area inline styles (9 occurrences); they are a documented platform need.

### What Should Be Changed

Ordered by value, not by effort:

1. Map the 118 legacy hex occurrences onto existing `--traveler-*` tokens. This
   is mechanical, low-risk, and unblocks any further visual work.
2. Adopt `Section` and `Row` in real product screens. Primitives that only
   appear in the design-system page are documentation, not a design system.
3. Decide the trip cover model (category enum vs uploaded image vs keep emoji)
   before rebuilding the dashboard card. The lab design is not implementable
   without a schema decision.
4. Decide bottom tab bar vs top header. This is listed as an open question in
   the lab roadmap and blocks both dashboard and trip-detail layout.
5. Add a Supabase runtime caching strategy and drop the dead Google Fonts rules.
6. Fix the accent-stripped Hungarian strings.
7. Promote `HeroTitle` from Planned to Exists, backed by the trip hero.

### What Should Explicitly Not Be Rebuilt

- The sharing model and its read-only projection (Phase 18 output).
- Auth, ownership and RLS boundaries.
- The AI endpoints and `sectionConfig` registry under `api/`.
- The trip Zod schema shape, beyond the additive cover/category decision.
- Page-level composition: no page needs splitting, all are under 200 lines.
- The editor workflow. Same view → edit → save → AI flow everywhere; a new
  editing pattern would violate the UX consistency rule.
- Anything without a design lab reference. Five audited areas have no lab
  screen; redesigning them now would be invention, not parity.

### First Three Recommended Implementation Subtasks

**A. Legacy color token migration (feeds 20-02)**

Replace the five legacy hexes with existing tokens across 28 files, including
the PWA manifest colors. No layout or markup changes. Independently reviewable
because the diff is a pure find-and-replace against a fixed token map, and the
visual result should be near-identical.

**B. Two product-screen decisions, written down (blocks 20-02)**

Resolve and document: (1) trip cover model — category enum, uploaded image, or
keep emoji; (2) bottom tab bar vs top header. Both are open questions in the lab
roadmap, both change the schema or the app shell, and both are cheap now and
expensive after the dashboard is rebuilt. Deliverable is a decision note, not
code.

**C. Section/Row adoption on the dashboard (first real parity slice)**

Migrate `HomePage` and its dashboard sections to the `Section` and `Row`
primitives, and fix the accent-stripped strings in the same pass. Small, visible,
and it proves the primitives work in production before wider rollout.

Deliberately excluded from the first three: the trip card redesign (blocked by
B), any trip-detail work (largest lab screen, needs its own task), and all
offline/live work (belongs to 20-06/20-07).

### Quality Gate Recommendation For The Next Implementation Task

The next task is the first code task of the phase, so run the Phase 13 clean
install gate once at the start:

```bash
rm -rf node_modules && pnpm install --frozen-lockfile
```

Then the standard gate on every change:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

Additional gates specific to this phase:

- `pnpm run build` must be warning-free before visual work begins, per the build
  log hygiene rule. Any remaining chunk-size warning needs a follow-up task, not
  a raised limit.
- After the color migration, re-run the legacy hex grep; it must return zero
  outside `DesignSystemPage` swatches.
- Visual changes need a manual mobile check at 390px width; there is no visual
  regression test in the project.

### Runtime Commands

Skipped. This task is a documentation audit and changed no source file, so
typecheck, lint, test and build have nothing new to verify. The next task, which
touches code, runs the full gate above.

### Review Checklist Result

- [x] No broad rewrite recommended without concrete evidence.
- [x] Pages remain route-level composition only; no page split proposed.
- [x] Shared UI/component opportunities identified (`Section`, `Row`,
      `HeroTitle`).
- [x] Hard-coded style debt listed separately from UX structure changes.
- [x] AI chat surfaces reviewed; the create-trip chat step is the one place to
      watch against the "chat is not the product" rule.
- [x] Live mode scoped time-based first; `getTripStatus` identified as the only
      existing time logic and the natural starting point.
- [x] Offline requirements focused on critical trip runtime data; the missing
      Supabase caching rule is the concrete blocker.
