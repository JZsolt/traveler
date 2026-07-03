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

# Folder Structure

## Current

```txt
src/
  components/
    ui/              # shadcn/ui primitives (Button, Badge, Card)
    editor/          # EditableSection, AiSuggestionPanel
    trip/            # Section components (PackingList, TripHero, BudgetSummary, etc.)
    DaySection.jsx   # Day display + inline editor
    ScheduleItem.jsx # Schedule item display + inline editor
    GuideInfo.jsx    # Guide collapsible display
    DbError.jsx      # DB error display

  pages/
    HomePage.jsx
    TripPage.jsx

  context/
    TripsContext.jsx  # Trip data provider (Supabase)

  hooks/
    useTripUpdater.js # Supabase save hook

  lib/
    supabase.js       # Supabase client
    tripSections.js   # Immutable trip data transform helpers

api/                  # Vercel serverless functions
  suggest-trip-section.js
  expand-day.js
  plan-trip.js
  backup-trips.js
```

## Future (when needed)

```txt
src/
  components/
    planner/         # Trip creation wizard
    admin/           # Admin/settings components
  lib/
    validation/      # Shared validators
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

---

# Code Organization Rules

These rules are mandatory for implementation and review work.

## Ownership

- Pages compose route-level views. They should not own complex workflow, persistence, AI, validation, or transformation logic.
- Custom hooks own stateful workflow logic and async UI flows.
- `lib/` modules own pure helpers, data transforms, validators, endpoint constants, and service utilities.
- Shared UI belongs in `src/components/` or `src/components/ui/`.
- Feature-specific UI belongs near its domain, for example `src/components/trip/`.

## Extraction Rules

- Anything used in 2+ places should become a shared component, hook, helper, or constant.
- Repeated editor patterns should move toward shared editor components.
- Repeated strings, section keys, endpoint paths, model ids, route paths, storage keys, and status labels should live outside JSX files.
- Do not over-centralize one-off values that are only meaningful in a single component.

## File Size

- Target file size is about 200 lines.
- Hard maximum is about 250 lines unless a task documents why the file must stay larger.
- When a touched file is over the target, prefer extracting hooks, child components, constants, or helpers before adding more logic.
- If a task cannot reduce an oversized file, document the remaining debt in the task summary or final review.

## Styling And Theme

- Use theme tokens and CSS variables where they exist.
- Do not add new hard-coded color palettes inside components.
- Avoid inline `style`; allow it only for platform/browser requirements such as safe-area values or runtime-calculated values.
- Do not start design-system migration during architecture cleanup. Phase 10 prepares the code; Phase 11 handles visual primitives and migration.

## Future TypeScript Rule

- When TypeScript is introduced, component files should not contain large embedded type/interface definitions.
- Shared types belong in dedicated `types` files near the feature or in a shared type module.

## Review Checklist

Every code review should check touched files for:

- page-level business logic that should move to a hook or helper
- repeated logic/UI used in 2+ places
- files drifting above 200 lines or exceeding 250 lines
- hard-coded constants, routes, endpoints, model ids, keys, or repeated copy
- hard-coded styles where theme tokens exist
- accidental mixing of architecture cleanup with visual redesign
