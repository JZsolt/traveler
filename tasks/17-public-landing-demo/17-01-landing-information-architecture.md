# 17-01 — Landing Information Architecture ✅ DONE

**Estimate:** 1-2 hours

## Goal

Define the content structure for the public landing page.

## Scope

- Hero
- How it works
- AI planning value
- Offline/PWA value
- Demo trip preview
- Login/register CTA

## Acceptance Criteria

- Landing outline is documented.
- Public visitor and logged-in user CTA behavior is defined.
- No real private trip data appears in the IA.
- Design follows existing design-system primitives.

## Review Checklist

- [x] Does not become a generic marketing page — section count is fixed at six
  plus footer, and pricing, testimonials, logos, and newsletter capture are
  explicitly excluded (`LANDING_IA.md` 4).
- [x] First viewport clearly explains Traveler — the hero must stand alone with
  positioning, one supporting sentence, and exactly one primary action
  (`LANDING_IA.md` 3.1).
- [x] Logged-in state points to `/app/trips` — authenticated root behavior:
  `/` is gated by `PublicOnlyRoute`, so a signed-in visitor is redirected to
  `ROUTES.TRIPS` instead of seeing the landing (`LANDING_IA.md` 5).
- [x] Admin is not mentioned — excluded in `LANDING_IA.md` 1, 3.7, and 6.

## Output

Documentation:

- `docs/product/LANDING_IA.md` (new) — route model, six-section outline with the
  design-system primitives each section uses, content rules, CTA behavior by
  session state, out-of-scope list, acceptance mapping.

No application code changed in this task.

Quality gate: typecheck OK, lint OK, 219 tests passed, build clean.
