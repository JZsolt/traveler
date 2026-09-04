# 20-01 — Design Lab Parity And Productization Audit

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

Pending.

