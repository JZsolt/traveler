# Landing Information Architecture

This document defines the content structure of the public landing page (`/`).

It is the reference for tasks `17-02` (demo trip strategy), `17-03` (public demo
route), and `17-04` (auth-aware landing). It defines **what** the landing page
says and **in what order** — not the visual design.

---

## 1. Purpose

The landing page answers three questions in the first viewport:

1. What is Traveler?
2. What can I do with it?
3. How do I start?

It is not a marketing site. It is the public front door of the application:
short, calm, product-first, and consistent with `UX_RULES.md`.

Constraints:

- `/` is public and must never load or render private trip data.
- The page is Hungarian, like the rest of the app.
- Admin, backup, import, and internal tooling are never mentioned.
- The page is built from existing design-system primitives; it introduces no
  new visual language and no new dependencies.

---

## 2. Route Model

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | public (anonymous only) | Landing page (this document) |
| `/demo` | public | Read-only demo trip (`17-02`, `17-03`) |
| `/login`, `/register` | public-only | Auth entry points |
| `/app/trips` | protected | The real application |

Before `17-04`, `ROUTES.HOME` redirected to `ROUTES.TRIPS`, so an anonymous
visitor was bounced on to `/login`. `ROUTES.HOME` now renders the landing page
behind `PublicOnlyRoute`: anonymous visitors get the landing, and authenticated
visitors are redirected to `ROUTES.TRIPS` once the auth session resolves
(section 5). The route sits outside `AppShell`, so no private trip fetch runs
while that decision is made. Any new route path (`/demo`) must be added to
`ROUTES` in `src/lib/constants.ts`, not hard-coded.

---

## 3. Section Outline

The landing page is a single scrollable column of sections, in this order.

### 3.1 Hero — "Mi ez?"

The only section guaranteed to be seen. It must explain Traveler on its own.

Content:

- Product name + one-line positioning: personal, AI-assisted travel companion
  that turns an idea into a usable itinerary in minutes.
- One supporting sentence: everything in one place, before and during the trip.
- Primary CTA (see section 5).
- Secondary CTA: "Nézd meg egy példán" → `/demo`.

Rules:

- Exactly one primary action (`UX_RULES.md` — One Primary Action).
- No screenshot carousel, no hero video, no statistics counters.
- No sign-up form in the hero; registration happens on `/register`.

Primitives: `Page`, `Section`, `Button`.

### 3.2 How It Works — "Hogyan működik?"

Three steps, mirroring the real planner flow in `INFORMATION_ARCHITECTURE.md`
(Questions → Generate → Edit/Use), so the promise matches the product.

1. **Mondd el, hova mennél** — destination, dates, travellers, budget, style.
2. **Traveler megtervezi** — day-by-day itinerary with places, food, links,
   costs.
3. **Alakítsd magadra** — every generated detail is editable by hand.

Rules:

- Exactly three steps. No numbered marketing funnel.
- Each step is one short sentence, no feature lists.

Primitives: `Section`, `Card`, `Row`.

### 3.3 AI Planning Value — "AI segít, nem helyettesít"

States the Trip First / AI Second principle from `PRODUCT_VISION.md`.

Content:

- AI drafts the itinerary and can improve any single block on request.
- The user always keeps control: nothing is saved automatically, everything is
  editable.
- The trip — not the chat — is the interface.

Rules:

- Do not present Traveler as a chatbot.
- No model names, no token/quota details, no prompt examples.

Primitives: `Section`, `Card`.

### 3.4 Offline / PWA Value — "Útközben is működik"

Content:

- Installable to the home screen, works like an app.
- The saved itinerary stays available on the phone during the trip, including
  weak or missing network coverage.
- Maps, opening info, and guides are collected in advance, so nothing has to be
  searched again on the spot.

Rules:

- Describe only offline behavior the app actually delivers; do not promise
  offline editing or offline AI.
- No install instructions here — the browser handles the install prompt.

Primitives: `Section`, `Card`, `Badge`.

### 3.5 Demo Trip Preview — "Nézd meg élesben"

The only place on the landing page that shows trip-shaped content.

Content:

- A compact preview of the demo trip: title, destination, length, a few day
  headlines.
- CTA: "Teljes példa megnyitása" → `/demo`.

Rules:

- The preview renders **only** the demo trip defined in `17-02`. It is public,
  fictional/curated content, never a real user's trip.
- No private trip data, no user names, no share links, no owner identity.
- The preview is read-only: no edit, save, AI, or delete affordances.
- If the demo trip cannot be loaded, the section degrades to the `/demo` CTA
  alone; the landing page must still render (`UX_RULES.md` — Error Handling).

Primitives: `Section`, `Card`, `Timeline` (or a read-only trip card), `Button`,
`LoadingState`, `EmptyState`.

### 3.6 Closing CTA — "Kezdd el"

Repeats the section 5 CTA at the end of the scroll, so the user does not have to
scroll back up.

Content:

- One short line restating the promise.
- Primary CTA (same target as the hero CTA).

Primitives: `Section`, `Button`.

### 3.7 Footer

Minimal: product name and a link to the demo. No admin, no internal routes, no
social/community links, no pricing.

---

## 4. Content Rules

- Hungarian copy, matching the app's existing tone: calm, concrete, no hype.
- Repeated landing copy lives in a constants module, not inline in the page
  component (`PROJECT_RULES.md` — Constants).
- No pricing, no testimonials, no logos, no newsletter capture.
- No feature the app does not currently ship.
- Section count is fixed at six plus footer; new landing ideas belong to an
  existing section or to a later task, not to a new top-level section.

---

## 5. CTA Behavior By Session State

The landing page is rendered for anonymous visitors. Authenticated visitors who
open `/` are redirected to `ROUTES.TRIPS` after the auth session resolves, so
they see their dashboard instead of the public landing.

### Anonymous visitor

| Placement | Label | Target |
|-----------|-------|--------|
| Hero primary | "Kezdjük" | `ROUTES.REGISTER` |
| Hero secondary | "Nézd meg egy példán" | `/demo` |
| Header | "Belépés" | `ROUTES.LOGIN` |
| Demo section | "Teljes példa megnyitása" | `/demo` |
| Closing | "Kezdjük" | `ROUTES.REGISTER` |

### Authenticated visitor

| Source | Behavior |
|--------|----------|
| `/` | Redirect to `ROUTES.TRIPS` |
| `/app/trips` | Dashboard renders normally |
| `/demo` | Public demo remains directly available |

Rules:

- The landing gate never fetches the visitor's trips to decide the redirect; it
  only reads the existing auth session state.
- While the session is resolving, render the existing auth loading state rather
  than briefly showing the anonymous landing.
- An authenticated visitor is auto-redirected away from `/` to `/app/trips`.
- Deep links into `/app/*` keep their existing protected-route behavior; the
  landing page does not change it.
- Because `PublicOnlyRoute` gates `/`, the landing only ever mounts for a
  resolved anonymous session. The authenticated and loading branches of
  `resolveLandingCta` are therefore defensive: they exist so the page stays
  correct if `/` is ever un-gated, and they remain unit-tested. They are not
  what prevents the redirect flicker today — the route gate is.

---

## 6. Out Of Scope

- Public trip search or a public trip directory.
- Pricing, plans, or a marketing site expansion.
- Social, community, or sharing entry points on `/`.
- Any admin or backup surface.
- Changes to the authenticated app's own home screen.

---

## 7. Acceptance Mapping

| `17-01` criterion | Where satisfied |
|-------------------|-----------------|
| Landing outline is documented | Section 3 |
| Public vs logged-in CTA behavior defined | Section 5 |
| No real private trip data in the IA | Sections 3.5, 4, 6 |
| Design follows existing design-system primitives | Primitives listed per section in 3 |
