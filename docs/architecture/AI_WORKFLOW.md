# Traveler AI Workflow

## Purpose

This document defines how AI is integrated into Traveler.

It describes when AI should be used, how it communicates with the application, and what rules it must always follow.

This is **not** a prompt document.

It is the architectural guide for AI features.

---

# AI Philosophy

AI is a tool.

AI is never the product.

Traveler is a travel planner.

AI simply helps users plan, improve and personalize trips.

Users should always feel in control.

---

# Core Principles

## User Owns The Trip

The user owns every piece of information.

AI only suggests.

The user decides.

---

## AI Never Writes Directly

AI must never write directly into the database.

Workflow:

User Action

↓

AI Request

↓

AI Response

↓

Preview

↓

User Accepts

↓

Database Update

---

## Everything Is Editable

Every AI generated result can be edited manually.

Users should never feel locked into generated content.

Manual edits always have priority.

---

## Small AI Tasks

Prefer many small AI requests instead of one huge request.

Good:

- Generate trip
- Improve one day
- Improve packing
- Rewrite budget
- Suggest restaurants

Avoid:

- Regenerate the whole trip

---

# AI Features

## 1. Trip Planner

Purpose

Generate the first draft of a trip.

Workflow

Home

↓

New Trip

↓

Basic Questions

↓

Brainstorm Chat

↓

Generate Draft

↓

Preview

↓

User Edit

↓

Save Trip

The generated draft should be compact.

It does not need every detail.

---

## 2. Day Expansion

Purpose

Expand one generated day.

Input

- Trip title
- Destination
- Travellers
- Current day

Output

A fully detailed day including:

- timeline
- guide
- costs
- useful links
- recommendations

Only one day is generated.

---

## 3. AI Improve

Purpose

Improve only one section.

Examples

Packing

↓

Improve

Budget

↓

Improve

Timeline

↓

Improve

Notes

↓

Improve

The rest of the trip must remain unchanged.

---

## 4. AI Assistant

Future feature.

Examples

- Restaurant recommendations
- Weather suggestions
- Local tips
- Alternative activities

The assistant should always understand the current trip context.

---

# Prompt Strategy

Prompts should remain small.

Avoid sending unnecessary history.

Prefer:

- current section
- trip summary
- destination
- user preferences

Avoid:

- entire database
- previous AI outputs
- unrelated conversations

---

# Token Optimization

AI requests should minimize token usage.

Strategies:

- Compact JSON
- Short field names when possible
- Generate only necessary sections
- Expand details only on demand
- Limit chat history
- Reuse stored trip information

Never send the whole trip if only one section changes.

---

# Validation

Every AI response must be validated.

Steps

1. Receive response

↓

2. Extract JSON

↓

3. Parse JSON

↓

4. Validate schema

↓

5. Show Preview

↓

6. Save after approval

Invalid responses must never be written to storage.

---

# Error Handling

Possible failures

- Invalid JSON
- Missing required fields
- Gemini quota exceeded
- Timeout
- Network error

The application should:

- explain the problem
- keep user input
- allow retry
- never lose work

---

# Retry Strategy

If generation fails:

1. Retry once automatically.

2. If quota exceeded:

Offer:

- Try again later
- Generate a smaller version
- Use Quick mode

---

# Security

Gemini API keys must never be exposed.

All AI requests go through Vercel API routes.

Secrets remain server-side.

---

# Future AI

Future versions may include:

- live travel assistant
- translation
- image understanding
- receipt parsing
- expense categorization
- voice planning

These should follow the same architecture.

---

# AI Design Goals

Every AI feature should be:

- fast
- reliable
- predictable
- transparent
- optional

AI should reduce planning time.

It should never reduce user control.

---

# Decision Rules

Before adding any AI feature ask:

- Does this solve a real travel problem?
- Does it save the user time?
- Can the user edit the result?
- Can it work without regenerating the whole trip?
- Is the output easy to validate?

If the answer is "no", redesign the feature.

---

# AI Workflow Summary

Trip Planning

Questions

↓

Brainstorm

↓

Generate Draft

↓

Preview

↓

Edit

↓

Save

↓

Supabase

---

Section Editing

Open Section

↓

AI Improve

↓

Preview

↓

Accept

↓

Supabase

---

# Guiding Principle

Traveler is not an AI application.

Traveler is a travel application enhanced by AI.

Every AI interaction should make planning easier without taking control away from the user.
