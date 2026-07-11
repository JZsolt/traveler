# 17 — Public Landing And Demo

Status: planned. Can start after the auth route model is stable.

## Goal

Replace the public root with a real landing/demo experience while keeping the
authenticated app under `/app`.

## Critical Principles

- `/` is public and does not show the real user's private trip list.
- Demo content is read-only and not a private user trip.
- Auth-aware CTAs change based on session.
- Admin features never appear on the public landing.

## Subtasks

1. `17-01-landing-information-architecture.md`
2. `17-02-demo-trip-strategy.md`
3. `17-03-public-demo-route.md`
4. `17-04-auth-aware-landing.md`

## Workflow

Implement exactly one task from `tasks/17-public-landing-demo/`, run the quality
gate, mark only that task done, and stop.

## Non-goals

- No public trip search.
- No pricing/marketing site expansion.
- No social/community features.
- No admin visibility.
