# 17-02 — Demo Trip Strategy ✅ DONE

**Estimate:** 1-2 hours

## Goal

Choose and document a safe demo trip data strategy.

## Scope

- Static versioned demo data, or
- Dedicated `is_demo` record strategy
- Read-only use
- No normal private user trip as demo

## Acceptance Criteria

- Demo data source is documented.
- Demo route cannot expose private user data.
- Demo content is stable for public visitors.
- Implementation path is compatible with Zod schemas.

## Review Checklist

- [x] Demo is not tied to a real private owner trip — the demo is static repo
  data with no `trips` row and no `owner_id`; copying a file from
  `backups/trips/by-slug/` is explicitly forbidden
  (`DEMO_TRIP_STRATEGY.md` 1, 3).
- [x] Demo cannot be edited by public visitors — read-only by construction:
  `ReadOnlyContext`, no `TripsProvider`, no `useTripUpdater` path, and no row a
  write could target (`DEMO_TRIP_STRATEGY.md` 5).
- [x] Demo strategy does not weaken RLS — the public-read policy option was
  rejected precisely because it would reintroduce the policy
  `004_trip_rls_owner_scoped.sql` removed; no migration is needed
  (`DEMO_TRIP_STRATEGY.md` 2, 5).
- [x] Data update workflow is documented — edit, guard test, quality gate, size
  check, deploy; no seed and no database change
  (`DEMO_TRIP_STRATEGY.md` 7).

## Output

Documentation:

- `docs/architecture/DEMO_TRIP_STRATEGY.md` (new) — the chosen static
  repository-data strategy, the three rejected alternatives with reasons, demo
  content rules and size budget, the Zod validation path, read-only guarantees,
  stability, update workflow, and the guard test `17-03` must add.
- `docs/architecture/DECISIONS.md` — new dated ADR entry "Public Demo Trip Data
  Source" (Accepted).

No application code changed in this task.

Quality gate: typecheck OK, lint OK, 219 tests passed, build clean.
