# 18-12 — Roadmap And Final State Audit ✅ DONE

**Estimate:** 1-2 hours

## Goal

Reconcile the roadmap, task headers, documentation, and implemented code for
Sharing V2 after the implementation subtasks are complete.

## Scope

- Verify every Phase 18 subtask status matches the actual implementation state.
- Verify `tasks/README.md` and `tasks/18-sharing-v2-account-qr.md` describe the
  same final state.
- Check that the Sharing V2 architecture docs point to the implemented files and
  current endpoint behavior.
- Confirm the final quality gate status is documented.
- Record any remaining follow-up work as explicit future tasks instead of hidden
  notes.

## Acceptance Criteria

- The Phase 18 parent task and roadmap agree on completion state.
- Completed subtasks are marked consistently.
- Any incomplete, deferred, or manual-only verification is explicitly documented.
- No implementation changes are made unless required to fix a discovered
  documentation mismatch.
- Full quality gate result is recorded, or any skipped command is explained.

## Review Checklist

- [x] Roadmap does not say `planned` for already completed Phase 18 work — the
  `planned` marker was removed earlier; this audit replaced the remaining
  "audit pending" wording with the three-part state the roadmap now carries:
  implementation ✅, automated audit ✅, live RLS verification pending.
- [x] Parent task does not claim more than the verified subtask state supports —
  each of 18-01 .. 18-11 was checked against code and tests (see Output); the
  parent now also carries the one unverified area (live RLS) as an open task
  rather than as an implicit claim.
- [x] Security checklist and Sharing V2 spec are still aligned — verified
  against the code; one overstated coverage claim was corrected and one
  contradicting doc (`DATABASE.md`) was fixed.
- [x] Manual Supabase/RLS checks are separated from automated test coverage —
  the checklist now states which section is asserted by `pnpm run test:run`,
  and the live section is explicitly marked as not yet executed.
- [x] Follow-up work is tracked as a task, not buried in prose — the live RLS
  verification became `18-13`, listed under the parent's Follow-up Tasks.


## Output

### What was verified

Phase 18's documented state was checked against the actual code, not just
against the other documents:

- **Endpoints**: all six `route=` values in `API` (`src/lib/constants.ts`) match
  the dispatch table in `api/sharing.ts` — no dangling or undocumented route.
- **Token handling**: `api/_share-token.ts` generates 32 random bytes and stores
  only a SHA-256 hash; `api/_share-crypto.ts` uses AES-256-GCM with a
  server-only key and a versioned key map. Matches the checklist.
- **RLS**: migrations `005` .. `010` add policies only to `trip_shares` and
  `trip_share_recipients`. No public `SELECT` policy was added to
  `public.trips`, so the Phase 16 lockdown still holds.
- **Recipient read path**: `api/_shared-with-me.ts` parses `trip_data` with
  `TripSchema` and returns `projectPublicTrip(...)`; pending invites are a
  four-field teaser. Matches the spec's critical boundary.
- **Abuse controls**: `api/_trip-invite-email.ts` enforces an owner hourly
  limit, a trip daily limit, and a duplicate window before the provider call.
- **Env**: every server secret the checklist names exists in `.env.example` with
  no `VITE_` prefix.
- **Tests**: 11 sharing test files covering token, crypto, public lookup, share
  management, recipients, shared-with-me, profile QR, and email invites.

### Findings and what was done about them

1. **Overstated automated coverage (security-relevant).** The checklist claimed
   that "malformed/random/expired/revoked tokens all return the same 404 class"
   was automatically covered. Malformed and unknown tokens were tested; the
   **revoked and expired** filters were not asserted anywhere, so a regression
   that dropped `.is('revoked_at', null)` or the `expires_at` filter from
   `api/_shared-trip-route.ts` would have kept a revoked link working with a
   green suite.
   Fixed by adding an assertion to `api/__tests__/shared-trip.test.ts`. The test
   was verified to be meaningful: removing the `revoked_at` filter from the
   route makes it fail, and the route was restored unchanged afterwards. The
   checklist wording was tightened to say what is actually asserted.

2. **Contradicting documentation.** `docs/architecture/DATABASE.md` still
   described sharing as Owner / **Editor** / Viewer with trip-level permissions,
   while `SHARING_V2_SPEC.md` lists collaboration roles as an explicit non-goal
   and the implementation grants read-only access only. Rewritten to the two
   implemented roles and the two separate viewer modes, with the Editor role
   called out as a non-goal that would need its own decision record.

3. **Inconsistent subtask markers.** 18-01 .. 18-07 used `— DONE` while
   18-08 .. 18-11 used `✅ DONE`. Normalized to `✅ DONE`.

4. **Stale deferral note.** 18-06's header still said "profile-QR path deferred
   to 18-09" although 18-09 is done. Replaced with a note that the path was
   delivered and is covered by the `trip-recipients` tests for active, disabled,
   and rotated profile QR ids.

5. **Unverified area, now tracked.** The checklist's "Live Supabase RLS Checks"
   had never been executed and nothing said so. The endpoint tests mock the
   Supabase client, so they cannot prove that RLS rejects a real cross-user
   read. The section is now marked "not yet executed" and the work is tracked as
   `18-13-live-supabase-rls-verification.md`.

### Resulting phase state

Phase 18 is **not** marked done. The audit closes the documentation and
automated-coverage side of it, but the security-relevant end-to-end check is
still outstanding, so the parent task and the roadmap both carry three separate
lines: implementation complete, automated audit complete, live RLS verification
pending (`18-13`). A green test suite is not evidence that RLS rejects a real
cross-user read, and this phase should not be called production-ready until
`18-13` says so.

### Not done, deliberately

- The live Supabase/RLS checks themselves — they need a real project and two
  real users, so they are `18-13`, not part of this audit.
- No production implementation code was changed; the only code change is one
  added regression test (`api/__tests__/shared-trip.test.ts`).

### Quality gate

`pnpm run typecheck`, `pnpm run lint`, `pnpm run test:run` (230 tests, 23
files), and `pnpm run build` all pass. No command was skipped.
