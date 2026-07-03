# Traveler Architecture

## Purpose

This document describes the technical architecture of Traveler.

It should help Claude, Codex and future developers understand where things belong and how the application should evolve.

---

# High-Level Architecture

Traveler is a mobile-first React PWA.

The application uses:

- React for the frontend
- Vite for development and build
- Tailwind CSS for styling
- Supabase for shared trip storage
- Vercel for deployment
- Vercel API routes for server-side AI calls
- Gemini API for AI-assisted planning and editing

---

# Core Principle

Traveler should stay as simple as possible.

Do not introduce a backend server unless absolutely necessary.

The preferred architecture is:

Frontend
↓
Vercel API routes
↓
External services

---

# Application Layers

## 1. Pages

Pages represent routes.

Examples:

- Home
- Planner
- Trip Overview
- Day View
- Block Detail
- Map
- Admin
- Design System

Pages should not contain complex business logic.

Pages compose components.

---

## 2. Feature Components

Feature components belong to a specific domain.

Examples:

- trip
- planner
- day
- blocks
- admin

Feature components may understand trip data.

---

## 3. UI Primitives

UI primitives live in:

`src/components/ui/`

Examples:

- Button
- Card
- Row
- Section
- Timeline
- Badge
- EditableField
- AIAssistButton

UI primitives should not know about Supabase, Gemini or trip-specific logic.

---

## 4. Data Layer

Data access should be isolated.

Supabase reads and writes should not be scattered randomly across pages.

Prefer small helper modules for:

- trips
- trip updates
- imports
- exports
- backups

---

## 5. API Layer

Vercel API routes are used for secret or server-side operations.

Examples:

- AI trip generation
- AI section improvement
- AI day expansion
- backup/admin utilities

API keys must never be exposed to the frontend.

---

# Suggested Folder Structure

```txt
src/
  components/
    ui/
    trip/
    planner/
    day/
    blocks/
    admin/

  pages/

  context/

  hooks/

  lib/
    supabase/
    ai/
    trip/
    validation/
    utils/
```

# Development Principles

When implementing new features:

1. Reuse existing UI primitives before creating new ones.
2. Keep business logic outside UI components.
3. Keep API routes focused on one responsibility.
4. Prefer extending existing flows over introducing new ones.
5. Avoid premature abstractions.
6. Every new feature should follow PRODUCT_VISION.md and UX_RULES.md.
7. Keep the codebase understandable for a solo developer.
