# 20-02 — Scoped Dashboard And Trip Detail Product Polish

**Estimate:** 2-3 hours

## Goal

Apply the first scoped design/product polish pass to the dashboard and trip
detail screens based on the 20-01 audit output.

## Inputs

The 20-01 audit output and two accepted decisions in
`docs/architecture/DECISIONS.md` (both dated 2026-09-07):

- **Trip Cover Model** — cover is an optional source-tagged field. Implement the
  `category` source (six bundled illustrations from
  `prototypes/utazasaim-design-lab/assets/categories/`) and the `url` source
  (external photo URL). Do **not** build upload or model-generated covers; they
  need Supabase Storage, which does not exist yet. Keep `emoji`.
- **Global Bottom Navigation** — add the global bottom bar (Utak / Uj / Profil).
  The trip detail Terv/Jegyek/Info bar in the lab is a separate per-screen
  segmented control, not this navigation, and is out of scope for this task.

Audit findings this task must act on:

- `Section` and `Row` primitives exist but are used only in `DesignSystemPage`;
  the dashboard is the first real adoption target.
- Legacy hard-coded colors in the touched files (`OwnedTripCard.tsx`,
  `Header.tsx`, `TripHero.tsx`, `TripPage.tsx`) must move to tokens.
- Accent-stripped Hungarian strings in `HomePage.tsx` need fixing.

## Required Reads

- `tasks/PROJECT_RULES.md`
- `tasks/20-productization-design-ai-live-mode/20-01-design-lab-parity-and-productization-audit.md`
- `docs/architecture/DECISIONS.md` (the two 2026-09-07 entries)
- `docs/design/VISUAL_LANGUAGE.md`
- `docs/design/COMPONENT_SPEC.md`
- `prototypes/utazasaim-design-lab/dashboard.html`

## Scope

- Preserve existing data loading, auth, ownership, sharing, and edit behavior.
- Use existing design tokens and UI primitives.
- Improve only the audited dashboard and trip detail gaps selected in 20-01.
- Keep the trip detail ready for future time-based live mode.

## Acceptance Criteria

- No broad visual rewrite.
- Pages remain route-level composition only.
- New reusable UI belongs under `src/components/` or `src/components/ui/`.
- Hard-coded legacy colors are reduced where touched.
- Mobile layout remains the primary target.
- Full quality gate passes.

## Output

Pending.

