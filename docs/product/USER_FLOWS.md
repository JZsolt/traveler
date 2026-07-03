# Traveler User Flows

This document describes how users move through Traveler.

It focuses on user journeys, not implementation.

---

# Core Principle

Every flow starts from a Trip.

Trips are the center of Traveler.

AI is only a tool that helps users create or improve trips.

---

# Flow 1 — Create a New Trip

Goal:

Create a complete travel plan in a few minutes.

Flow:

Home
↓
New Trip
↓
Basic Questions
↓
Brainstorm Chat
↓
Generate Trip
↓
Preview
↓
Manual Adjustments (optional)
↓
Save Trip
↓
Trip Overview

Notes:

- AI should ask only useful questions.
- Users can freely brainstorm before generation.
- Generation should feel collaborative.
- Preview before saving is mandatory.

---

# Flow 2 — Open Existing Trip

Goal:

Continue planning or prepare for travelling.

Flow:

Home
↓
Select Trip
↓
Trip Overview

From here users can open:

- Days
- Packing
- Budget
- Notes
- Hotels
- Flights
- Settings

---

# Flow 3 — Daily Usage

Goal:

Quickly access today's plan.

Flow:

Home
↓
Upcoming Trip
↓
Today
↓
Timeline

Possible actions:

- Navigate
- Open place
- Read details
- Check completed items
- Edit schedule
- AI Improve

---

# Flow 4 — Edit Content

Goal:

Allow users to modify everything.

Flow:

Open Block
↓
View
↓
Edit
↓
Save

Optional:

AI Improve
↓
Preview Changes
↓
Accept

Users should always remain in control.

---

# Flow 5 — AI Improve

Goal:

Improve only one section.

Examples:

Packing

↓

AI Improve

↓

Updated Packing

Budget

↓

AI Improve

↓

Updated Budget

Day

↓

AI Improve

↓

Updated Timeline

Never regenerate the entire trip unless requested.

---

# Flow 6 — Add Manual Content

Goal:

Allow users to extend AI-generated trips.

Examples:

- Add restaurant
- Add museum
- Add note
- Add activity
- Add flight
- Add accommodation

Manual changes should never be overwritten automatically.

---

# Flow 7 — Share Trip

Future feature.

Goal:

Travel together.

Flow:

Trip
↓
Share
↓
Invite Users
↓
Choose Permissions

Permissions:

- Owner
- Editor
- Viewer

Editors can edit.

Viewers cannot.

---

# Flow 8 — Completed Trip

Goal:

Keep memories.

Flow:

Trip Ends
↓
Move to Past Trips

Users can still:

- Browse
- Edit
- Duplicate
- Export

Completed trips remain available forever.

---

# Flow Rules

Every flow should:

- require as few steps as possible
- avoid unnecessary dialogs
- keep users oriented
- preserve user data
- be reversible whenever possible

---

# UX Goals

Every major task should feel:

- fast
- predictable
- calm
- enjoyable

The interface should never make users wonder:

"What should I do next?"

The next action should always be obvious.
