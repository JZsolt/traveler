# 20 — Productization, Design Refresh, AI Guardrails And Live Mode

Status: planned.

This phase turns the existing Traveler app into a more coherent, product-grade
travel planning and travel runtime experience. It does not rebuild the app from
scratch. It refines the existing screens, AI flows, sharing foundation, trip
data, ticket display, and PWA/offline direction into a user-friendly mobile-first
product.

Important:

- Do not start with a broad redesign.
- Do not rebuild existing working flows unless the current task proves that a
  targeted refactor is necessary.
- Use the existing design foundation and primitives.
- Use `prototypes/utazasaim-design-lab` as the visual reference.
- Keep pages as route-level composition only.
- Preserve existing auth, ownership, sharing, AI preview, and save behavior.
- AI changes must be guarded, domain-specific, and validated at boundaries.
- Offline/live-mode work should start time-based; GPS is a later optional layer.

## Product Direction

The app should feel like an end-to-end travel operating system:

- before travel: ideation, brief, planning, trusted generation;
- during travel: today view, next step, time-based progress, contextual help;
- documents: ticket, booking, link, and future Wallet-compatible handling;
- collaboration: shared trips that can later evolve from read-only to controlled
  co-editing;
- business: free short trips, paid serious travel and collaboration.

## Subtasks

1. `20-01-design-lab-parity-and-productization-audit.md` — ✅ done
2. `20-02-scoped-dashboard-and-trip-detail-product-polish.md` — planned
3. `20-03-create-trip-guided-flow-and-ai-surface-audit.md` — planned
4. `20-04-ai-domain-guardrails-and-usage-metering-spec.md` — planned
5. `20-05-evidence-data-integrations-risk-and-cost-spec.md` — planned
6. `20-06-offline-runtime-and-time-based-live-mode-spec.md` — planned
7. `20-07-trip-runtime-cache-foundation.md` — planned
8. `20-08-tickets-and-documents-foundation-spec.md` — planned
9. `20-09-wallet-feasibility-and-platform-decision.md` — planned
10. `20-10-shared-trip-collaboration-v2-spec.md` — planned
11. `20-11-subscription-limits-and-billing-model-spec.md` — planned
12. `20-12-travel-journal-and-collector-retention-spec.md` — planned
13. `20-13-native-extensions-widgets-and-wrapper-decision.md` — planned

## Initial Epic Backlog

### Epic 1 — Scoped Product-Grade Design Refresh

Design lab parity audit, dashboard polish, trip detail runtime layout, create
trip guided flow, shared view consistency, and legacy style cleanup.

### Epic 2 — Trusted AI Generation And Guardrails

Domain guardrails, better prompt and output structure, AI usage metering, and
situation-based actions instead of generic chat. Source-backed trip data is
related, but it is tracked as a separate evidence-data integration risk because
fresh opening hours, ticket prices, official links, and live status are not
reliably solved by prompting alone.

### Epic 3 — Offline Runtime And Time-Based Live Mode

Trip runtime cache plus a GPS-free MVP that uses schedule times to show where
the user should be, what is next, whether the day is late, and what can be
modified. Offline readiness is a prerequisite for travel-time usefulness.

### Epic 4 — Tickets And Documents

Structured tickets, bookings, entry documents, critical codes, official links,
and document metadata.

### Epic 5 — Evidence Data Integrations

Google Places or equivalent lookup, official POI links, opening hours, ticket
purchase links, live-status options, cache strategy, data confidence, and API
cost modeling.

### Epic 6 — Shared Trip Collaboration V2

Controlled co-editing, owner approval, change notifications, and participant
visibility on shared trips.

### Epic 7 — Usage Limits And Billing

Usage metering starts with AI guardrails; billing and package enforcement can
follow later. Free short-trip limits and paid plans should be tied to measured
AI and data costs.

### Epic 8 — Travel Journal And Collector

Trip archive, diary-style retrospective, saved memories, and collection value
for users who want to revisit and organize past travel.

### Epic 9 — Native Extensions Later

Wallet deepening, mobile widgets, and native wrapper decisions. These are not
PWA MVP features.

## Risks And Open Questions

- Evidence-backed plans require data integrations, not just better prompts.
- Real iOS Wallet support requires Apple Developer Program membership and
  server-side pass signing.
- Mobile widgets are deferred unless a native wrapper/app is introduced.
- Travel Collector monetization needs journal/archive functionality to support
  the persona.
- Phase 20 must define success metrics: AI acceptance rate, regeneration rate,
  token cost per trip, live-mode usage, share activation, and free-to-paid
  conversion.

## Workflow

Open and implement exactly one task file from
`tasks/20-productization-design-ai-live-mode/`, then stop.

Do not continue to the next task automatically.

For implementation tasks, run:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

For documentation-only audit tasks, explain why runtime commands were skipped.
