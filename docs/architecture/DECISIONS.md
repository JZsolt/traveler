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

Traveler is **not** an AI application.

Traveler is a travel planner enhanced by AI.

AI is an assistant.

Never the product.

**Reason**

People come to Traveler to plan trips.

AI simply helps them do it faster.

**Status**

Accepted

---

## 2026-07-03

### Editing Model

**Decision**

Every AI-generated result must remain editable.

AI suggestions always require user approval before saving.

Manual edits always take priority.

**Reason**

Users must always feel in control of their own travel plans.

**Status**

Accepted

---

## 2026-07-03

### AI Database Access

**Decision**

AI never writes directly to the database.

Workflow:

User

↓

AI Suggestion

↓

Preview

↓

User Accepts

↓

Database Update

**Reason**

Prevents accidental data loss.

Makes AI predictable.

Keeps the user in control.

**Status**

Accepted

---

## 2026-07-03

### Modular Data Model

**Decision**

Trips should evolve towards a modular structure.

Instead of one large JSON document, independent sections should eventually become independent database records.

Example:

```
Trip
│
├── Days
├── Timeline Items
├── Packing Items
├── Budget Items
├── Notes
└── Collaborators
```

**Reason**

Supports:

- Collaboration
- AI section updates
- Offline synchronization
- Smaller updates
- Better scalability

This migration does not need to happen immediately.

**Status**

Planned

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

# Guiding Principle

Every architectural and product decision should answer one question:

> **Does this make planning trips faster, simpler and more enjoyable?**

If not, reconsider the decision.
