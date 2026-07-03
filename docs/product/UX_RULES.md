# Traveler UX Rules

This document defines the UX rules of Traveler.

Every new feature, page and component should follow these rules.

---

# Core Philosophy

Traveler should feel like a premium travel journal.

Not like:

- an admin dashboard
- an enterprise application
- a chatbot
- a settings application

The interface should be:

- calm
- clean
- predictable
- fast
- mobile first

---

# Navigation

The application hierarchy is always:

Home
↓
Trip
↓
Day
↓
Block

Never introduce additional hierarchy unless absolutely necessary.

Users should always know where they are.

---

# Trip First, AI Second

See [PRODUCT_VISION.md](PRODUCT_VISION.md) for the full philosophy.

Trips are the center. Everything belongs to a Trip. AI appears only when it provides value — never as the primary interface.

---

# Editing

Everything should be editable.

Every editable component follows exactly the same workflow.

View

↓

Edit

↓

Save

↓

Undo

↓

AI Improve

Never invent a different editing flow.

---

# One Primary Action

Every screen has ONE primary action.

Examples:

Home

→ New Trip

Planner

→ Generate Trip

Trip

→ Open Today

Day

→ Edit Timeline

Avoid multiple competing CTA buttons.

---

# Progressive Disclosure

Do not overwhelm users.

Show the minimum amount of information.

Reveal details only when requested.

Example:

Trip

↓

Day

↓

Schedule Item

↓

Extra Details

---

# Typography

Typography creates hierarchy.

Not colors.

Not shadows.

Not borders.

Use:

- headings
- spacing
- alignment

before using decoration.

---

# Whitespace

Whitespace is intentional.

Do not fill empty areas without purpose.

Whitespace increases readability.

---

# Cards

Cards are NOT the default layout.

Use cards only for:

- grouped information
- interactive content
- important summaries

Simple information should use rows.

---

# Timeline

Timeline is the default representation of a day.

Whenever a daily itinerary exists, prefer Timeline over cards.

---

# Lists

Lists should always support:

- Add
- Delete
- Reorder

If AI is available:

- AI Improve

---

# Consistency

Every button behaves the same.

Every dialog behaves the same.

Every editable block behaves the same.

Every list behaves the same.

Every page follows the same structure.

Consistency is more important than creativity.

---

# Error Handling

Users should never lose their work.

Always:

- autosave when appropriate
- allow undo
- clearly show errors
- clearly show loading

---

# Mobile First

Traveler is designed primarily for mobile.

Every important interaction should be possible using one hand.

Avoid:

- tiny touch targets
- hidden actions
- hover interactions

---

# Accessibility

Use:

- readable font sizes
- sufficient contrast
- descriptive icons
- clear labels

Avoid relying only on color.

---

# Decision Rule

Before implementing any new UI ask:

Does this make the experience:

- simpler?
- faster?
- calmer?
- more consistent?

If not, redesign it.
