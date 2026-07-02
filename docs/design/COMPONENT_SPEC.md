# Traveler Component Spec

## Folder

Create reusable UI primitives in:

src/components/ui/

## Core primitives

### Page

Purpose:
- consistent mobile page wrapper
- safe area
- max width
- background

Props:
- children
- className

### PageHeader

Purpose:
- top navigation area
- back button, title, more/actions

Use:
- every main page

### HeroTitle

Purpose:
- big trip/page title
- metadata
- optional flag/emoji as content, not icon system

### Section

Purpose:
- vertical page section

Props:
- label
- title
- action
- children

### Timeline

Purpose:
- display day schedule

Subcomponents:
- Timeline
- TimelineItem

TimelineItem props:
- time
- title
- description
- badges
- highlight
- actions

### Row

Purpose:
- simple clickable row for settings/trip blocks

Props:
- icon
- title
- subtitle
- action
- onClick

### Card

Purpose:
- grouped interactive content only

Do not use Card for every element.

### Button

Variants:
- primary
- secondary
- ghost
- danger
- ai

Sizes:
- sm
- md
- lg

### Badge

Variants:
- neutral
- primary
- warning
- success
- danger
- ai

### EditableField

Purpose:
- manual editing of one field

States:
- view
- edit
- saving
- error

### EditableBlock

Purpose:
- edit larger JSON block

Supports:
- manual edit
- AI assist
- undo

### AIAssistButton

Purpose:
- subtle AI edit entry point

Label:
- "AI segítség"
- "AI módosítás"
- not just "✨"

## Component rules

- No page should define its own button style.
- No page should define its own card style.
- Use primitives before creating new UI.
- If a new primitive is needed, add it to this doc first.
