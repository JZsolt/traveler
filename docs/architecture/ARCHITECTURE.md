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
  schemas/             # Zod runtime schemas (single source of truth)
  types/               # TypeScript type definitions
  components/
    ui/              # shadcn/ui primitives (Button, Badge, Card)
    editor/          # EditableSection, AiSuggestionPanel, DirtyCancelRow
    trip/            # Section components (PackingList, TripHero, BudgetSummary, etc.)
    DaySection.tsx   # Day display + inline editor
    ScheduleItem.tsx # Schedule item display + inline editor
    GuideInfo.tsx    # Guide collapsible display
    DbError.tsx      # DB error display
    BackupButton.tsx # GitHub backup export
    ImportBackup.tsx # Backup import UI

  pages/
    HomePage.tsx
    TripPage.tsx
    CreateTripPage.tsx
    EditTripPage.tsx
    SettingsPage.tsx

  context/
    TripsContext.tsx  # Trip data provider (Supabase)
    AdminContext.tsx  # Admin session provider

  hooks/
    useTripUpdater.ts # Supabase save hook
    useEditTrip.ts    # Trip edit workflow
    useExpandDay.ts   # AI day expansion
    useAdmin.ts       # Admin context hook
    ...               # + more editor/workflow hooks

  lib/
    supabase.ts       # Supabase client
    tripSections.ts   # Immutable trip data transform helpers
    normalizeTrip.ts  # Trip normalization + Zod final gate
    constants.ts      # Centralized constants

api/                  # Vercel serverless functions (TypeScript)
  suggest-trip-section.ts
  expand-day.ts
  plan-trip.ts
  backup-trips.ts
  import-trip-backup.ts
  import-trip-backups.ts
  admin-login.ts
  _suggest-helpers.ts   # sectionConfig factory
  _section-configs.ts   # Section config registry
  _backup-fetch.ts      # Supabase row fetch + validation
  _backup-github.ts     # GitHub commit helper
  _backup-utils.ts      # Backup file/manifest builder
  _import-utils.ts      # Import helper
  _admin-auth.ts        # Admin password validation
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
- Repeated strings, section keys, endpoint paths, model ids, route paths, storage keys, and status labels should live outside component files.
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
- Do not start design-system migration during architecture cleanup. Architecture and runtime validation phases prepare the code; the design-system phase handles visual primitives and migration.

## TypeScript Rules

- Component, hook, page, lib, and API files must not contain inline `type` or `interface` definitions.
- Shared types belong in `src/types/`. Runtime schemas belong in `src/schemas/`.
- No `any`, `as any`, `Record<string, any>`, or `any[]`. Use `unknown` + narrowing at boundaries.

## Review Checklist

Every code review should check touched files for:

- page-level business logic that should move to a hook or helper
- repeated logic/UI used in 2+ places
- files drifting above 200 lines or exceeding 250 lines
- hard-coded constants, routes, endpoints, model ids, keys, or repeated copy
- hard-coded styles where theme tokens exist
- accidental mixing of architecture cleanup with visual redesign

---

# File Size Audit

Last updated: 2026-07-03

## Remaining over 250 lines

| File | Lines | Why it's over | Next extraction (Phase 11+) |
|------|-------|---------------|----------------------------|
| `TripHero.tsx` | 296 | Accommodation + flight inline editors are ~80 lines each of form JSX with no shared pattern | Extract `AccommodationEditor` and `FlightEditor` to `components/trip/` when design-system primitives provide a shared form pattern |
| `DaySection.tsx` | 291 | 3 hooks extracted; remainder is images/lightbox/tickets/alerts/transport JSX | Lightbox could become a shared component if used elsewhere; otherwise leave as-is |
| `CreateTripPage.tsx` | 290 | Chat + generation hook extracted; remainder is form + chat UI template | Form step and chat step could split into child components when layout primitives exist |
| `PracticalInfo.tsx` | 276 | Single render-heavy section with inline edit form | Extract section editor form to shared `EditableSection` pattern if design-system unifies section editors |

## Under 250 lines (OK)

EditTripPage (227), ImportBackup (198), UsefulLinks (194), BookingChecklist (192), TripPage (189), SavingTips (180), PackingList (157), BudgetSummary (150), BackupButton (130), HomePage (116), EditableSection (110), AiSuggestionPanel (93), SettingsPage (91), tripSections (88), GuideInfo (83)

---

# Constants Inventory

Last updated: 2026-07-03

Repeated magic strings that should become shared constants during 10-09.

## API Paths (10 occurrences across src/)

`/api/backup-trips`, `/api/import-trip-backup`, `/api/import-trip-backups`, `/api/admin-login`, `/api/suggest-trip-section`, `/api/expand-day`, `/api/plan-trip`, `/api/chat`

Target: `src/lib/constants.ts` (already centralized)

## Route Paths

`/`, `/trip/:slug`, `/trip/:slug/edit`, `/create-trip`, `/settings`

Target: `src/lib/constants.ts` (already centralized)

## AI Model IDs (duplicated in TripPage + CreateTripPage)

`gemini-3.1-flash-lite`, `gemini-2.5-flash` — model option arrays duplicated with labels.

Target: `src/lib/constants.ts` (already centralized)

## Storage Keys

`admin_unlocked` — only one, already in a const in AdminContext.

Target: `src/lib/constants.ts` (already centralized)

## Trip Section Keys (used with replaceTripSection)

`packingList`, `usefulLinks`, `savingTips`, `bookingChecklist`, `practicalInfo`

Target: already string args to `replaceTripSection`, low priority.

## Theme Colors (89 occurrences of hard-coded hex)

`#1a1a2e`, `#0f3460`, `#e94560`, `#16213e` — used throughout all components.

Target: CSS variables / Tailwind theme tokens (Phase 11).

## API Error Codes

`METHOD_NOT_ALLOWED`, `MISSING_SUPABASE_ENV`, `INVALID_MODE`, `INVALID_ADMIN_PASSWORD`, etc. — repeated across API files with local `err()` helpers.

Target: `api/_suggest-helpers.ts` already has `errorResponse`; other API files use inline error helpers.

---

# Shared Editor Patterns Audit

Last updated: 2026-07-03

## Repeated Patterns

### 1. Dirty cancel confirmation (6 instances)

`EditableSection`, `ScheduleItem`, `TripHero`, `BudgetSummary`, `DaySection` (meta + advanced).
Pattern: `confirmCancel` state + `initialDraft` useRef + JSON.stringify compare + Elvetés/Vissza buttons.

Extraction: `useDirtyCancel(draft, initialDraft)` hook returning `{ isDirty, confirmCancel, requestCancel, forceCancel, dismissCancel }`.
Safety: safe to extract — pure state logic, no side effects.

### 2. Save/cancel button row (5+ instances)

Mentés + Mégse/Elvetés/Vissza + optional AI button — in EditableSection, ScheduleItem editor, TripHero editor, BudgetSummary editor, DaySection meta/advanced editors.

Extraction: `<EditorToolbar onSave onCancel saving confirmCancel onAi />` component.
Safety: safe — pure presentational.

### 3. ArrayEditor (1 definition, 4 usages)

Originally defined inside ScheduleItem. Used for badges, links, transport, guide arrays.

Extraction: moved to `src/components/editor/ArrayEditor.tsx`.
Safety: safe — self-contained, no external dependencies.

### 4. AI suggestion panel

`AiSuggestionPanel` already extracted to `src/components/editor/`. Used in EditableSection (via prop) and DaySection (inline schedule AI). The DaySection inline AI is a separate pattern (fetch + preview + apply to pendingDayDraft).

Extraction: DaySection's inline schedule AI could use a `useScheduleAi` hook.
Safety: moderate — interacts with pendingDayDraft state.

### 5. List editor pattern (add/delete/reorder)

PackingList, UsefulLinks, SavingTips, BookingChecklist — each has local add/delete/reorder logic with nearly identical structure.

Extraction: `useListEditor(items, { onAdd, onDelete, onMove })` hook.
Safety: safe after individual editor hooks are extracted.

### 6. Validation error display

Inline `<p className="text-xs text-red-600">` for validation errors — repeated in ScheduleItem, EditableSection, TripHero, BudgetSummary.

Extraction: `<ValidationError message={...} />` component (trivial).
Safety: safe — trivial.

## Extraction Order (recommended for 10-08)

1. `ArrayEditor` — move to own file (zero risk)
2. `useDirtyCancel` hook — extract state logic (low risk)
3. `EditorToolbar` — extract save/cancel/AI buttons (low risk)
4. `ValidationError` — trivial extract
5. `useScheduleAi` — DaySection schedule AI logic (moderate risk)
6. `useListEditor` — after section hooks are done
