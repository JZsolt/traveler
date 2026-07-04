# Traveler Visual Language Implementation Plan

## Goal

Implement the new Traveler visual language gradually without breaking the app.

Do not redesign the entire app in one pass.

## Phase 1 — Add documentation ✅

Created:

docs/design/
- VISUAL_LANGUAGE.md
- ICON_SYSTEM.md
- TYPOGRAPHY.md
- COMPONENT_SPEC.md
- IMPLEMENTATION_PLAN.md

## Pre-migration audit (Phase 10)

### Inline styles

All inline `style={{ }}` usages are safe-area-inset related (PWA notch handling). These must stay as inline styles because Tailwind cannot express `env(safe-area-inset-top)` or `calc()` with it.

Locations (13 occurrences):
- `Header.jsx` (2x) — safe area top padding
- `TripPage.jsx` (3x) — main padding-top
- `HomePage.jsx` (2x) — main padding-top
- `EditTripPage.jsx` (2x) — main padding-top
- `CreateTripPage.jsx` (1x) — main padding-top
- `SettingsPage.jsx` (1x) — main padding-top
- `DaySection.jsx` (2x) — image fade-in + lightbox close button

No inline styles need removal. The safe-area pattern could be extracted to a CSS class in Phase 2.

### Hard-coded colors

| Color | Count | Usage |
|-------|-------|-------|
| `#0f3460` | 63 | Primary — buttons, links, accents |
| `#1a1a2e` | 33 | Dark — headers, day bars, gradients |
| `#e94560` | 16 | Accent red — CTA, day numbers, save |
| `#d63d56` | 7 | Hover variant of accent red |
| `#16213e` | 2 | Darker navy (footer) |

These map cleanly to CSS custom properties in Phase 2:
- `#0f3460` → `--color-primary`
- `#1a1a2e` → `--color-dark` / gradient start
- `#e94560` → `--color-accent`
- `#d63d56` → `--color-accent-hover`

### Repeated patterns

- `rounded-2xl` used on cards, day bars, modals — consistent
- `rounded-xl` used on inputs, sub-panels — consistent
- `text-xs h-7` used on all action buttons — consistent
- Shadow usage is minimal (only modals + toast)

No low-risk fixes needed — patterns are already consistent.

## Phase 2 — Add CSS tokens (Not started)

Add or update global CSS variables:

Colors:
- --color-paper: #FAFAF8
- --color-ink: #111827
- --color-body: #374151
- --color-muted: #6B7280
- --color-line: #E5E7EB
- --color-primary: #0F4C81
- --color-accent: #F97316

Radius:
- --radius-sm: 10px
- --radius-md: 16px
- --radius-lg: 24px
- --radius-xl: 28px
- --radius-pill: 999px

Shadow:
- --shadow-soft: 0 18px 50px rgba(17, 24, 39, 0.08)
- --shadow-card: 0 1px 3px rgba(17, 24, 39, 0.06)

Do not redesign pages in this phase.

## Phase 3 — Create primitives (Partial)

Create:

Existing (via shadcn/ui):
- src/components/ui/button.jsx ✅
- src/components/ui/card.jsx ✅
- src/components/ui/badge.jsx ✅

Existing (custom):
- src/components/editor/EditableSection.jsx ✅
- src/components/editor/AiSuggestionPanel.jsx ✅

Not yet created:
- src/components/ui/Page.jsx
- src/components/ui/PageHeader.jsx
- src/components/ui/Section.jsx
- src/components/ui/Row.jsx
- src/components/ui/Timeline.jsx

Keep components simple.
Do not add dependencies unless required.

## Phase 4 — Create design system route (Not started)

Add route:

/design-system

Show:
- colors
- typography
- buttons
- badges
- rows
- cards
- timeline
- AI assist
- editable states

This is a developer-only reference page.

## Phase 5 — Migrate Trip overview first (Not started)

Migrate only the main Trip overview page.

Requirements:
- editorial hero
- timeline for today/current day
- rows for trip blocks
- AI assist as secondary action
- bottom navigation stays simple
- no random colors
- no emoji icon system

Stop after this page.

## Phase 6 — Migrate Day view (Not started)

Migrate day detail page to:
- big day title
- timeline schedule
- inline edit actions
- AI assist per section

## Phase 7 — Migrate CreateTripPage (Not started)

Migrate AI trip creation page to:
- calm form
- simple chat or preference block
- compact preview
- one main CTA

## Phase 8 — Polish (Not started)

Add:
- empty states
- loading states
- error states
- skeletons
- mobile spacing fixes
- accessibility labels

## Acceptance criteria

- UI looks consistent across pages.
- Lucide icons are used consistently.
- Orange is only used for AI/CTA.
- Pages feel spacious but content-dense enough.
- Cards are used intentionally.
- Timeline is the main itinerary pattern.
- Claude should not invent one-off styles.
