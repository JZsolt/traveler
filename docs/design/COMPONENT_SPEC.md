# Traveler Component Spec

## Folder

Reusable UI primitives live in `src/components/ui/`.

Editor components live in `src/components/editor/`.

## Status legend

- **Exists** — implemented and in use
- **Planned** — not yet implemented

## Existing primitives

### Button — Exists

Source: shadcn/ui (`src/components/ui/button.tsx`)

Variants: default, outline, secondary, ghost, destructive, link

Sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg

### Badge — Exists

Source: shadcn/ui (`src/components/ui/badge.tsx`)

### Card — Exists

Source: shadcn/ui (`src/components/ui/card.tsx`)

### EditableSection — Exists

Source: `src/components/editor/EditableSection.tsx`

Purpose: Section edit shell with view/edit mode, dirty-state confirmation, optional AI button.

States: view, edit, saving, error, dirty-cancel-confirm

### AiSuggestionPanel — Exists

Source: `src/components/editor/AiSuggestionPanel.tsx`

Purpose: Shared AI suggestion panel (instruction → fetch → preview → apply/discard).

Props: section, trip, onApply, renderPreview, applyLabel, extraBody

## Planned primitives

### Page — Exists

Source: `src/components/ui/Page.tsx`

Purpose: consistent mobile page wrapper (safe area, max width, background).

Props: constrained, className, children

### PageHeader — Exists

Source: `src/components/ui/PageHeader.tsx`

Purpose: top navigation area (back button, title, actions).

Props: title, subtitle, leading, trailing, className

### HeroTitle — Planned

Purpose: big trip/page title with metadata.

### Section — Planned

Purpose: vertical page section with label, title, action, children.

### Timeline — Planned

Purpose: display day schedule as a timeline (currently done inline in DaySection/ScheduleItem).

### Row — Planned

Purpose: simple clickable row for settings/trip blocks.

## Component rules

- No page should define its own button style.
- No page should define its own card style.
- Use primitives before creating new UI.
- If a new primitive is needed, add it to this doc first.
