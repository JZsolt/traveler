# 16 — Read-Only Trip Sharing

Status: planned. Start only after Phase 15 ownership and RLS are complete.

## Goal

Allow a trip owner to create a revocable public read-only share link.

## Critical Principles

- Public sharing must not make the whole `trips` table publicly readable.
- The browser receives the raw token; the database stores only a hash.
- Share links grant read-only public projection access, not owner rights.
- The shared trip page must use read-only presentation components, not disabled
  editor components.

## Subtasks

1. `16-01-sharing-product-threat-model.md`
2. `16-02-share-database-model.md`
3. `16-03-secure-share-creation-endpoint.md`
4. `16-04-public-shared-trip-lookup.md`
5. `16-05-public-trip-projection-schema.md`
6. `16-06-read-only-shared-trip-page.md`
7. `16-07-share-management-ui.md`
8. `16-08-sharing-security-tests.md`

## Workflow

Implement exactly one task from `tasks/16-read-only-trip-sharing/`, run the
quality gate, mark only that task done, and stop.

## Non-goals

- No public trip search.
- No collaboration roles.
- No comments.
- No editable shared links.
