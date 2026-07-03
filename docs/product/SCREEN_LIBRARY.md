# Traveler Screen Library

This document defines every screen of Traveler.

Every new feature should belong to an existing screen whenever possible.

Avoid creating new top-level pages.

---

# Screen 1 — Home

Purpose

The home page is the entry point of the application.

It answers two questions:

- Where am I going?
- Where have I been?

Primary Action

- New Trip

Content

- Upcoming Trips
- Past Trips
- Search (future)
- Quick statistics (future)

Components

- PageHeader
- TripCard
- Section
- Button

---

# Screen 2 — Planner

Purpose

Help users create a new trip.

Primary Action

Generate Trip

Flow

Questions

↓

Brainstorm

↓

Generate

↓

Preview

↓

Save

Components

- Question Card
- Chat
- AI Suggestion
- Generate Button
- Preview Card

Rules

Users should never feel forced to use AI.

They should always be able to edit before saving.

---

# Screen 3 — Trip Overview

Purpose

Central hub of a trip.

Primary Action

Open Today

Content

- Hero
- Today's Plan
- Days
- Packing
- Budget
- Notes
- Hotels
- Flights
- Checklist

Components

- Hero
- Timeline Preview
- Row List
- Section
- AI Assist

Rules

This page should feel like the table of contents of a travel journal.

---

# Screen 4 — Day

Purpose

Display one day's itinerary.

Primary Action

Edit Timeline

Content

- Timeline
- Places
- Food
- Notes
- Costs
- AI Improve

Components

- Timeline
- TimelineItem
- Badge
- Section

Rules

Timeline is the primary layout.

Avoid using cards for every item.

---

# Screen 5 — Block Detail

Purpose

Display and edit one block.

Examples

- Packing
- Budget
- Hotel
- Flight
- Notes

Primary Action

Save

Secondary Action

AI Improve

Components

- EditableField
- EditableList
- AI Button

Rules

Every block behaves identically.

---

# Screen 6 — Map

Purpose

Show locations for the current trip.

Primary Action

Open Navigation

Content

- Places
- Current Day
- Routes

Future

Offline maps.

---

# Screen 7 — Settings

Purpose

Application preferences.

Content

- Theme
- Language
- Export
- Backup
- About

Rules

Keep simple.

---

# Screen 8 — Admin

Purpose

Developer tools.

Examples

- Backup
- Restore
- Import
- Export
- Debug AI
- Database tools

This page is hidden from normal users.

---

# Screen 9 — Design System

Purpose

Developer reference.

Contains

- Buttons
- Typography
- Colors
- Timeline
- Rows
- Cards
- Inputs
- AI Components

Never expose to production users.

---

# Navigation

The primary navigation is:

Home

↓

Trip

↓

Day

↓

Block

Everything else is secondary.

---

# Future Screens

Possible future additions:

- Collaborative Editing
- Expense Analytics
- Offline Downloads
- Travel Memories
- Notifications

Do not create these screens until there is a real need.
