# Traveler Database Philosophy

## Purpose

This document describes how Traveler stores data.

It is **not** a database schema.

It defines how the application thinks about travel data.

The implementation (Supabase tables, JSON structure, etc.) may evolve, but these principles should remain stable.

---

# Core Principle

The Trip is the center of the application.

Everything belongs to exactly one Trip.

```
Trip
│
├── Days
├── Packing
├── Budget
├── Flights
├── Hotels
├── Notes
├── Checklist
└── Settings
```

No feature should exist outside of a Trip.

---

# Modular Structure

A Trip is made up of independent sections.

Each section can be:

- viewed
- edited manually
- improved by AI
- saved independently

Examples:

- Day
- Packing
- Budget
- Notes

AI should never need to regenerate the entire trip to update a single section.

---

# Trip

A Trip stores high-level information.

Examples:

- title
- destination
- emoji
- startDate
- endDate
- travellers
- cover image
- metadata

The Trip should stay lightweight.

Detailed information belongs to child sections.

---

# Days

A Trip contains one or more Days.

```
Trip
    ↓
 Days
```

A Day is the primary planning unit.

Each Day contains:

- title
- subtitle
- timeline
- costs
- images
- alerts

---

# Timeline

The timeline is the heart of every Day.

```
Day

↓

Timeline

↓

Timeline Items
```

Every Timeline Item represents one activity.

Examples:

- sightseeing
- restaurant
- travel
- hotel
- break
- shopping
- custom activity

Timeline items should be independent.

Users should be able to:

- reorder
- edit
- delete
- duplicate
- improve with AI

---

# Supporting Objects

Timeline items may contain supporting information.

Examples:

Guide

- history
- tips
- mustSee
- funFacts

Navigation

- Google Maps
- walking route
- public transport

Media

- images
- captions

References

- websites
- Wikipedia
- booking links

These objects enrich the experience but should remain optional.

---

# Lists

Traveler uses lists everywhere.

Examples:

Packing

↓

Items

Budget

↓

Items

Checklist

↓

Items

Notes

↓

Items

Timeline

↓

Items

Keeping the data model consistent simplifies both the UI and AI workflows.

---

# AI Philosophy

AI never owns the data.

The user owns the data.

AI only proposes content.

Workflow:

User
↓

AI Suggestion

↓

Preview

↓

Accept

↓

Database Update

AI should never write directly to persistent storage.

---

# Manual Editing

Every piece of generated content must remain editable.

Users should never feel locked into AI-generated text.

Manual edits always take priority over AI output.

---

# Sharing

A Trip can be shared with multiple users.

Possible roles:

- Owner
- Editor
- Viewer

Permissions should be managed at the Trip level.

Child objects inherit permissions.

---

# Future Extensibility

New features should fit into the existing hierarchy.

Example:

Trip
├── Memories
├── Expenses
├── Offline Files
├── Journal
└── Collaborators

Avoid creating unrelated top-level entities.

---

# Data Integrity

Traveler should avoid duplicated information.

Examples:

Destination belongs to Trip.

Not every Day.

Traveller information belongs to Trip.

Not every Timeline Item.

Only store information where it logically belongs.

---

# Storage Principles

The database should be:

- simple
- modular
- easy to migrate
- easy to synchronize
- easy to share

Optimize for clarity before optimization for performance.

---

# Database Goals

The data model should support:

- manual editing
- AI generation
- AI improvements
- collaboration
- synchronization
- offline support
- future mobile applications

without requiring major structural changes.
