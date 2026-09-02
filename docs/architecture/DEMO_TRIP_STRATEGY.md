# Demo Trip Strategy

This document defines where the public demo trip's data comes from, how it is
validated, how it stays read-only, and how it is updated.

It is the reference for tasks `17-03` (public demo route) and `17-04`
(auth-aware landing), and complements `docs/product/LANDING_IA.md`.

---

## 1. Decision

**The demo trip is static, versioned repository data — not a database record.**

- Source file: `src/data/demo/demo-trip.json`
- Authored in the same shape as any other trip (`_template.json` structure), so
  it parses with the existing `TripSchema`.
- Loaded by a dedicated helper, validated with Zod, and projected through the
  existing `projectPublicTrip()` before rendering.
- Never written to Supabase, never owned by a user, never reachable from
  `/app/*`.

---

## 2. Why Not The Alternatives

### Rejected: `is_demo` flag on a `trips` row with a public read policy

Reading it publicly would require a `SELECT` policy on `public.trips` for the
`anon` role. `004_trip_rls_owner_scoped.sql` deliberately dropped the legacy
"Trips are publicly readable" policy, and `PROJECT_RULES.md` forbids re-opening
`trips` for public reads. A demo page is not a good enough reason to reintroduce
the exact policy the auth phase removed — one mistake in the predicate exposes
every private trip.

### Rejected: `is_demo` row served by a service-role endpoint

Technically safe (the service role bypasses RLS, and `projectPublicTrip()` would
still gate the output), but it adds an unauthenticated, database-touching
endpoint for content that is identical for every visitor and changes a few times
a year. That means new rate-limiting and abuse surface, plus a landing page that
breaks when Supabase is down — the one page that must always render.

### Rejected: a permanent share token for a real trip

Reusing `/share/:token` with a never-expiring token would tie the public demo to
a real owner's private trip row. The owner could revoke or delete it, the demo
would silently 404, and `17-02`'s requirement "no normal private user trip as
demo" would be violated in substance even if the projection hides the sensitive
fields.

### Accepted trade-off of the static approach

Updating the demo requires a commit and a deploy. This is acceptable — and
actually desirable — because the demo is marketing-critical content that should
be reviewed, not edited live.

---

## 3. Data Rules For The Demo File

The demo trip is **authored content**, not an export of anyone's real trip.

- Fictional or generic destination content only. It must not be created by
  copying a file from `backups/trips/by-slug/`.
- No real people: no traveller names, no owner identity, no contact details.
- No booking references, confirmation numbers, ticket links, or accommodation
  addresses tied to a real reservation.
- The following fields must be **absent from the file**, not merely stripped at
  projection time: `days[].tickets`, `insurance`, `status`, `aiModel`,
  `expandedDays`, `days[]._draft`.
- `slug` is the constant `DEMO_TRIP_SLUG` (`'demo'`), added to
  `src/lib/constants.ts` — not hard-coded in components.
- Hungarian copy, consistent with the rest of the app.
- No typographic quotes (`„ " "`) — the existing repo rule applies.

### Size budget

Real trips in `backups/` range from 17 KB to 96 KB. The demo file targets
**≤ 40 KB raw** (roughly a 3–4 day trip with 4–6 schedule items per day): enough
to look like a genuine itinerary in the demo preview, small enough not to bloat
the bundle. The loader uses a dynamic `import()` so the JSON lands in its own
chunk and never enters the landing page's initial payload.

---

## 4. Validation Path

The JSON file is external data and starts as `unknown`, exactly like Supabase or
imported backup data.

```
demo-trip.json (unknown)
  -> TripSchema.safeParse()          // full trip shape, existing schema
  -> projectPublicTrip(trip)         // whitelist projection, existing function
  -> PublicTrip                      // what the demo route renders
```

Rules:

- No new schema is introduced. The demo reuses `TripSchema` and the
  `PublicTripSchema` projection that already guards `/share/:token`.
- Parsing through `projectPublicTrip()` is mandatory even though the file is
  repo-controlled. It guarantees the demo can never render a field that real
  public sharing would withhold, and it keeps a single projection path to audit.
- Parse failure is a controlled failure, not a crash: the demo route shows the
  existing error state and the landing page's demo section degrades to its CTA
  (see `LANDING_IA.md` 3.5). It must never fall back to unvalidated data.
- The loader lives in `src/lib/` (helper) or `src/hooks/` (if it needs loading
  state); the page composes only.

---

## 5. Read-Only Guarantees

The demo is read-only by construction, not by hiding buttons:

1. It renders inside the existing `ReadOnlyContext.Provider value={true}` tree,
   the same mechanism `SharedTripPage` uses, so editor, AI, and delete controls
   are not rendered.
2. The route lives outside `/app/*` and outside `TripsProvider`, so no private
   trip fetch and no `useTripUpdater` save path exists on the page.
3. There is no trip row and no `owner_id`, so there is nothing for a write to
   target — a save attempt has no destination, not merely no button.
4. The public header (`SharedHeader`) is used instead of the app header, so no
   owner, settings, or admin controls appear.

RLS is untouched by this feature. No migration is needed for `17-03`.

---

## 6. Stability For Public Visitors

- The content is versioned in git and changes only through a reviewed commit.
- It is identical for every visitor, in every session, authenticated or not.
- It does not depend on Supabase availability, on a token's expiry, or on any
  user's actions.
- It is precached by the existing PWA service worker like any other build asset,
  so a returning visitor sees it offline too.

---

## 7. Update Workflow

1. Edit `src/data/demo/demo-trip.json`.
2. Run `pnpm run test:run` — the demo guard test (see below) parses the file
   with `TripSchema` and asserts the forbidden fields are absent.
3. Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`.
4. Check the size budget from section 3.
5. Commit and deploy. There is no seed step and no database change.

### Required guard test

`17-03` must add a test (in `src/schemas/__tests__/` or `src/lib/__tests__/`)
that:

- parses the real `demo-trip.json` with `TripSchema` and expects success;
- runs `projectPublicTrip()` on it and expects success;
- asserts the file itself contains none of the forbidden fields from section 3;
- asserts `slug === DEMO_TRIP_SLUG`.

This is what keeps a future hand-edit of the demo file from shipping broken or
leaky content.

---

## 8. Out Of Scope

- Multiple demo trips or a demo trip picker.
- Letting visitors fork the demo into their own account (a later task may add
  "Save a copy" after registration; it is not part of phase 17).
- Any write path, AI call, or share action from the demo page.
- Seeding the demo into Supabase.

---

## 9. Acceptance Mapping

| `17-02` criterion | Where satisfied |
|-------------------|-----------------|
| Demo data source is documented | Sections 1, 3 |
| Demo route cannot expose private user data | Sections 2, 3, 4, 5 |
| Demo content is stable for public visitors | Section 6 |
| Implementation path is compatible with Zod schemas | Section 4 |
| Not tied to a real private owner trip | Sections 1, 2, 3 |
| Cannot be edited by public visitors | Section 5 |
| Does not weaken RLS | Sections 2, 5 |
| Data update workflow documented | Section 7 |
