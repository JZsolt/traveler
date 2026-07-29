# Read-Only Trip Sharing Specification

## Purpose

Phase 16 adds revocable public read-only share links for trips. This document
defines the product behavior, security boundary, and public projection before
database, endpoint, or UI work starts.

## Goals

- A trip owner can create a public link for one trip.
- Anyone with the link can view a read-only public version of that trip.
- The owner can revoke the link.
- A share can optionally expire.
- Shared trips are non-indexed by default.
- Public access never grants owner, editor, admin, backup, or import rights.

## Non-Goals

- No public trip search.
- No collaboration roles.
- No comments.
- No editable shared links.
- No public read policy on `public.trips`.
- No anonymous access to raw private trip rows.

## Route Model

Public shared trip view:

```text
/share/:token
```

The route is public and does not require Supabase auth. It must not mount the
authenticated app shell, private trip dashboard, editor controls, admin entry
points, backup controls, or mutation actions.

Authenticated share management remains under protected owner-only `/app/*`
routes. The exact management route can be refined during the UI task.

## Token Model

The public URL contains a raw random token:

```text
https://example.com/share/<raw-token>
```

Rules:

- The token must be generated server-side with cryptographic randomness.
- The token must not be a trip id, slug, owner id, or database row id.
- The raw token is shown to the browser only once when the share is created.
- The database stores only a hash of the token.
- Token lookup compares a hash of the received raw token with stored hashes.
- Tokens must be long enough that online guessing is impractical.

Recommended initial shape: at least 32 random bytes encoded with base64url,
stored as a SHA-256 hash or equivalent deterministic hash.

## Database Boundary

Public sharing uses a separate share model. It does not change trip ownership
and does not embed share state inside `trip_data`.

Planned table:

```sql
trip_shares (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  token_hash text not null unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz null,
  revoked_at timestamptz null
)
```

Security decision: no public `SELECT` policy is added to `public.trips`.

Public share lookup must use a dedicated server endpoint or database function
that returns only the public projection defined below. Normal trip CRUD stays
protected by owner-scoped RLS on `public.trips`.

## Public Projection

The public response is a read-only view model, not a raw `trips` row.

Allowed fields:

- `slug`
- `title`
- `subtitle`
- `destination`
- `startDate`
- `endDate`
- `emoji`
- `people`
- `status`
- `highlights`
- `days`
- `packingList`
- `usefulLinks`
- `savingTips`
- `practicalInfo`
- `accommodation`
- `flights`
- `costs`
- public `images`, `links`, `tickets`, and `guide` itinerary content

Excluded fields:

- `id`
- `owner_id`
- owner email or profile data
- admin state
- backup metadata
- raw share token
- `token_hash`
- service/debug fields
- private import/export internals
- any future field explicitly marked private

The public projection must be validated with a dedicated Zod schema before the
browser receives it. The shared trip page must use read-only presentation
components, not disabled editor components.

## Share Lifecycle

### Create

1. Owner requests a share for one owned trip.
2. Server verifies JWT and ownership.
3. Server creates a raw token, stores only its hash, and returns the URL once.

### View

1. Public visitor opens `/share/:token`.
2. Server hashes the token and finds a matching share row.
3. Server rejects missing, revoked, or expired shares.
4. Server returns only the public projection.

### Revoke

1. Owner requests revoke for a share row on their own trip.
2. Server verifies ownership and sets `revoked_at`.
3. Future public lookups return the generic not-found response.

### Expire

If `expires_at` is set and is in the past, public lookup must fail. Expiry is
optional for owners, but the data model must support it from the beginning.

## Threat Model

### Token Guessing

Risk: an attacker guesses valid share URLs.

Controls:

- Use high-entropy random tokens.
- Never use slug, trip id, share id, or owner id as the token.
- Store only token hashes.
- Return the same generic public error for missing, revoked, and expired tokens.
- Do not expose token existence through management endpoints to non-owners.

### Revoked Tokens

Risk: a previously shared URL remains usable after revocation.

Controls:

- Public lookup must check `revoked_at is null`.
- Revoke operation must be owner-verified server-side.
- Client-side hiding is not enough; revoked links must fail at the data access
  boundary.

### Expired Tokens

Risk: an expired share continues to work because only the UI checks expiry.

Controls:

- Public lookup must check `expires_at is null or expires_at > now()`.
- Expiry failure must return the same generic public not-found response.

### Owner Spoofing

Risk: a user creates, lists, revokes, or modifies shares for another user's
trip by passing a foreign `trip_id`, `owner_id`, or share id.

Controls:

- Management endpoints derive the user id from the Supabase JWT.
- `created_by` and ownership are set server-side.
- Client-provided owner values are ignored.
- Share management queries join/check `trips.owner_id = auth.uid()`.
- RLS policies on `trip_shares` must be owner-scoped through the linked trip.

### Data Projection Leaks

Risk: public responses leak owner ids, emails, admin data, backup metadata, raw
tokens, or future private fields.

Controls:

- Never return raw `trips` rows from public endpoints.
- Use an explicit public projection builder.
- Validate public output with a dedicated Zod schema.
- New trip fields are private by default until explicitly added to the public
  projection.

### Mutation Through Shared View

Risk: public visitors mutate trip data via hidden editor controls or API calls.

Controls:

- Shared route uses read-only components.
- Public endpoint supports lookup only.
- Existing mutation endpoints continue to require authenticated JWT.
- RLS remains owner-scoped for `public.trips`.

## Required Implementation Decisions

- Public sharing does not add `SELECT using (true)` or any equivalent public
  read policy to `public.trips`.
- Public token possession grants read-only access to one public projection.
- Share management never bypasses trip ownership.
- Raw token exists only in the browser URL and create response, not in the
  database.
- Public projection schema is defined before endpoint work.
- Shared pages are non-indexed by default.
