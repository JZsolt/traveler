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

Vercel is the primary deployment platform.

**Reason**

Simple deployment.

Excellent React support.

Easy environment variable management.

Serverless API routes for AI.

**Status**

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
