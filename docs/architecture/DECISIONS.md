# Traveler Decisions

## Purpose

This document records important product, UX and architectural decisions.

It explains **why** decisions were made, not how they are implemented.

Only long-term decisions belong here.

Avoid documenting temporary implementation details.

---

# Rules

Every decision should contain:

- Date
- Decision
- Reason
- Status

Possible statuses:

- Accepted
- Planned
- Rejected
- Deprecated

---

# Decision Log

---

## 2026-07-03

### Product Philosophy

**Decision**

Traveler is **Trip-first**.

The Trip is the center of the entire application.

Everything belongs to a Trip.

Examples:

- Days
- Packing
- Budget
- Flights
- Hotels
- Notes
- Checklist

**Reason**

This creates a simple mental model.

Users never have to wonder where information belongs.

**Status**

Accepted

---

## 2026-07-03

### AI Philosophy

**Decision**

AI is an assistant, not the product. AI never writes directly to the database — every result goes through preview → user accept → save. Every generated result remains manually editable.

See [AI_WORKFLOW.md](AI_WORKFLOW.md) for detailed rules.

**Reason**

Users must always feel in control of their own travel plans.

**Status**

Accepted

---

## 2026-07-03

### Timeline First

**Decision**

Timeline is the primary UI pattern for daily itineraries.

Cards are secondary.

**Reason**

Timelines are easier to scan, edit and understand during travel.

**Status**

Accepted

---

## 2026-07-03

### Frontend First

**Decision**

Traveler remains a frontend-first application.

Backend logic should only exist when necessary.

Examples:

- AI
- Authentication
- Database access
- Backup

**Reason**

Keeps the project simple.

Reduces maintenance.

Fits a solo developer workflow.

**Status**

Accepted

---

## 2026-07-03

### Deployment Platform

**Decision**

The primary deployment platform moved to Docker/Coolify self-hosting.

**Reason**

Simple deployment.

Excellent React support.

Easy environment variable management.

Serverless API routes for AI.

**Status**

Active.

Accepted

---

## 2026-07-03

### Design Philosophy

**Decision**

Traveler should feel calm.

Not flashy.

Not overloaded.

The interface should resemble a premium travel journal.

**Reason**

Travel planning already contains a lot of information.

The interface should reduce cognitive load instead of increasing it.

**Status**

Accepted

---

## 2026-07-03

### Mobile First

**Decision**

Every new feature must be designed for mobile first.

Desktop is an enhancement.

Not the primary experience.

**Reason**

Most users will interact with Traveler while travelling.

**Status**

Accepted

---

## 2026-07-03

### Simplicity Over Features

**Decision**

Prefer improving existing features over adding new ones.

Avoid feature creep.

**Reason**

A smaller, polished application is more valuable than a larger unfinished one.

Every feature should support the core mission of Traveler.

**Status**

Accepted

---

## 2026-07-03

### Migration Over Rewrite

**Decision**

Traveler should evolve through small, incremental migrations.

Large rewrites should be avoided whenever possible.

When improving existing features:

- preserve existing behavior
- preserve business logic
- migrate one component at a time
- keep changes small and reviewable
- prefer many small commits over one large commit

New features should reuse the existing architecture and design system whenever possible.

**Reason**

The project already has a solid foundation.

Incremental migration:

- reduces bugs
- makes testing easier
- keeps the application stable
- allows continuous improvements
- makes AI-assisted development more predictable

This philosophy is especially important for a solo developer working with AI coding assistants.

**Status**

Accepted

---

## 2026-07-03

### Modular Trip Data Model

**Decision**

Traveler will evolve towards a modular data model.

Instead of storing an entire trip as one large JSON document, independent sections will gradually become independent database records.

Examples:

- trips

- days

- timeline_items

- packing_items

- budget_items

- notes

- hotels

- flights

**Reason**

This architecture enables:

- Smaller updates

- AI editing only the affected section

- Better collaboration

- Easier synchronization

- Better offline support

- Improved scalability

- Easier future mobile applications

The current JSON structure remains valid during the MVP phase.

Migration will happen only when it provides clear value.

**Status**

Planned

---

## 2026-09-02

### Public Demo Trip Data Source

**Decision**

The public demo trip is static, versioned repository data
(`src/data/demo/demo-trip.json`), validated with the existing `TripSchema` and
rendered through the existing `projectPublicTrip()` projection.

It is not a database row, not owned by any user, and not reachable from a share
token.

**Reason**

Serving the demo from `trips` would require either a public `SELECT` policy on
`public.trips` — the exact policy `004_trip_rls_owner_scoped.sql` removed — or a
new unauthenticated database endpoint for content that is identical for every
visitor and changes a few times a year.

Static data keeps the landing page available when Supabase is not, keeps RLS
untouched, and makes demo content a reviewed commit instead of a live edit.

The cost is that updating the demo needs a deploy, which is acceptable for
marketing-critical content.

Details: `docs/architecture/DEMO_TRIP_STRATEGY.md`

**Status**

Accepted

---

## 2026-09-07

### Trip Cover Model

**Decision**

A trip cover is an optional, source-tagged field. The source decides where the
image comes from, and new sources can be added without a schema break:

- `category` — one of six bundled illustrations, shipped with the app.
- `url` — an external photo URL, typically Wikimedia Commons, and typically
  suggested by AI during trip generation. Only the URL is stored.
- `upload` — a user-uploaded photo. **Planned**, not implemented.
- `ai` — a model-generated image. **Planned**, not implemented.

Phase 20 implements `category` and `url` only. The existing `emoji` field stays
as secondary trip identity and is not removed.

**Reason**

Real user photos are the desired end state, but the project has no Supabase
Storage integration at all: no bucket, no policies, no upload UI, and no
migration. Adding that is a feature in its own right, and the public `/share`
projection would need its own read rule for cover files.

Meanwhile both implementable sources already have precedent in the codebase.
`ImageSchema { url, caption? }` is how day and schedule images already work, and
the service worker already caches `upload.wikimedia.org` with a CacheFirst rule,
so a URL cover works offline on day one.

Model-generated covers are grouped with uploads rather than with URL suggestions
because they produce bytes that must be stored somewhere. Generation does not
avoid the storage work, it requires the same infrastructure plus a per-trip
generation cost.

The source tag exists so that adding `upload` and `ai` later is additive. Naming
the field after a single source now, such as `category`, would force a migration
and branching render logic once real photos arrive.

The emoji is kept because it is used in more than ten places as trip identity —
hero, dashboard cards, shared views, pending invites and the landing page — and
replacing it is unrelated to the cover decision.

**Status**

Accepted for `category` and `url`. Planned for `upload` and `ai`.

---

## 2026-09-07

### Global Bottom Navigation

**Decision**

The authenticated app gets a global bottom navigation bar with three targets:
Utak, a centre Uj action, and Profil.

Deeper screens keep the existing top header in a back and breadcrumb role. The
two do not compete, because the bottom bar switches app areas and the header
says where you are inside one.

The bottom bar in `prototypes/utazasaim-design-lab/trip-detail.html` is **not**
this navigation. It is a per-screen segmented control (Terv, Jegyek, Info) that
swaps panels within the trip detail. The two share a CSS class name in the lab
but are different patterns and must not be implemented as one component.

**Reason**

`docs/product/UX_RULES.md` requires that every important interaction be possible
one-handed on mobile. A fixed top header puts the primary navigation and the
main action in the hardest part of the screen to reach.

The design lab dashboard already resolves this open question from
`prototypes/utazasaim-design-lab/ROADMAP.md`, and the decision is cheap now and
expensive after the dashboard layout is rebuilt, because a bottom bar changes
the safe-area and scroll padding of every screen it appears on.

**Status**

Accepted

---

## Rejected Decisions

### AI-first Interface

**Rejected**

Reason:

Traveler is a travel planner.

Not a chatbot.

---

### AI Writes Directly To Database

**Rejected**

Reason:

Users should always review AI generated content before saving.

---

### One Large Permanent Trip JSON

**Rejected (Long-term)**

Reason:

Would make collaboration, synchronization and partial AI updates difficult.

---

### Complex Backend

**Rejected**

Reason:

Current architecture is intentionally frontend-first.

Introduce additional backend services only when clearly justified.

---

# Future Decisions

New long-term decisions should be added here as the project evolves.

Examples:

- Offline support
- Push notifications
- Native mobile apps
- Collaborative editing
- AI provider changes
- Database migrations
- Authentication strategy

# Guiding Principle

Every architectural and product decision should answer one question:

> **Does this make planning trips faster, simpler and more enjoyable?**

If not, reconsider the decision.
