# Sharing V2 Specification — QR, Persistent Links, and Account Sharing

## Purpose

Phase 18 extends the Phase 16 read-only public sharing (see
[`SHARING_SPEC.md`](./SHARING_SPEC.md)) with three capabilities:

1. **Persistent, re-displayable public links** with a **QR code**, so an owner
   can reopen the share modal and see/copy/scan the currently active link.
2. **Account-to-account sharing**, so an existing app user can receive a trip
   into a safe, opt-in "Megosztva velem" (shared-with-me) area.
3. **Profile QR and email invites** as abuse-resistant, opt-in convenience paths.

Everything in the Phase 16 spec still holds. This document only defines the V2
additions and the decisions that constrain them. Where V2 and V1 disagree, V2
wins **only for the explicitly listed changes**; all other V1 rules are
unchanged.

## Two distinct sharing modes

V2 keeps two sharing modes strictly separate. They must not be conflated in
code, data, or UX.

| | **Public link sharing** | **Account recipient sharing** |
|---|---|---|
| Audience | Anyone with the URL/QR (anonymous ok) | A specific existing app user |
| Auth to view | None | Recipient must be logged in |
| Data source | `trip_shares` (token) | `trip_share_recipients` (invite) |
| Grant | Read-only public projection | Read-only public projection |
| Consent | Owner creates a link | Owner invites **and** recipient accepts |
| Appears in dashboard | No | Yes, after acceptance |

Both modes return **the same `PublicTrip` projection**. Neither mode ever
returns a raw `trips` row to the browser, and neither adds a public `SELECT`
policy to `public.trips`.

## Goals

- Owner can reopen the share modal and always see/copy the **active** public
  link and its QR, without generating a new one.
- QR encodes the public URL and is downloadable as an image.
- Owner can invite an existing app user by typed email or by scanning that
  user's opt-in profile QR.
- A non-existing app user can be reached only via the public link (e.g. by
  email), never by a silently-claimable account membership.
- Recipients see a live, read-only, projected view of the owner's current trip.
- Profile QR and email invites are opt-in and rate/abuse limited.

## Non-goals

- No edit/collaboration roles (recipients are read-only).
- No public trip search or discovery.
- No comments or reactions.
- No public `SELECT` policy on `public.trips`.
- No plaintext public share token storage.
- No email sending without a provider, rate limits, and abuse controls.
- No claim-on-signup account access created from an email match alone.

## Public link persistence and token storage

### Problem

Phase 16 stores only `token_hash` and shows the raw token to the browser **once**
at creation. That is ideal for a bare-database-dump threat, but it means the
modal cannot re-display an existing link. V2 needs re-display.

### Decision

- **Lookup stays hash-only.** The anonymous `shared-trip` lookup path continues
  to hash the received token and match `token_hash`. It **never** decrypts
  anything. This boundary is unchanged from V1.
- **Add reversible ciphertext for owner re-display only.** Store
  `token_ciphertext` (authenticated encryption, e.g. AES-256-GCM) plus
  `token_key_version int not null default 1`. The raw token is **never** stored
  in plaintext.
- **Decryption is owner-only and server-only.** Only an owner-authenticated
  management endpoint may decrypt, and only to return the active public URL to
  that owner. The encryption key lives in a server env var
  (`SHARE_TOKEN_ENCRYPTION_KEY`) and is never shipped to the client.
- **Key versioning** is stored so keys can be rotated later (decrypt with old,
  re-encrypt with new). V2 ships with version 1.

### Honest trade-off

This weakens the property "a DB dump alone cannot recover active links" to "a DB
dump **plus** the encryption key can recover active links." For read-only
itinerary links this is an acceptable, deliberate trade for the UX. The key must
be treated as a secret with the same care as the service-role key.

### Legacy Phase 16 shares

Shares created in Phase 16 have `token_hash` but no `token_ciphertext`. Their raw
link **cannot** be re-displayed. Deterministic behavior:

- The management endpoint reports such a share as "active but not re-displayable."
- The UI explains the old link cannot be shown and offers **regenerate** (which
  revokes the old share and creates a new one with ciphertext).

## QR UX

- The QR encodes the **public URL** (`/share/<token>`), never the token hash or
  ciphertext.
- QR is rendered client-side from the URL with a small library or inline path;
  download exports a PNG from a canvas (or equivalent lightweight path).
- The modal's primary state shows: QR, the URL text, **Copy link**, **Download
  QR**, and **Disable sharing**. The active link is visible without generating a
  new one.
- A disabled/revoked or non-re-displayable share is never shown as an active
  link.
- The raw token is not persisted in local/session storage.

## Account recipient sharing

### Data model (see 18-05)

`trip_share_recipients` links a recipient to a trip/share with lifecycle
timestamps: `created_at`, `accepted_at`, `declined_at`, `revoked_at`. Key rules:

- `recipient_user_id` identifies the recipient. A recipient row only exists for a
  **resolved existing app user**.
- `recipient_email` is stored **only alongside a resolved `recipient_user_id`**
  for invite display, audit, and dedup. There are **no standalone email-only
  claimable recipient rows**.
- Foreign keys declare `on delete` behavior intentionally (trip/share deletion
  cascades recipient rows; user deletion is explicit and leaves no unusable
  orphan rows).
- Recipient RLS exposes only a user's own recipient rows; it **never** grants a
  `SELECT` on raw `trips`.

### Lifecycle and accept gate

```text
invite ──> pending ──accept──> accepted ──(owner revoke)──> revoked
                 └──decline──> declined
```

- An invite starts **pending**. A pending invite does **not** appear in the
  recipient's "Megosztva velem" list and does not grant access.
- The trip appears in "Megosztva velem" **only after the recipient accepts**.
  This double consent (owner invites + recipient accepts) is the primary
  anti-harassment control.
- The recipient can **decline**. The owner can **revoke** a pending or accepted
  invite; revoke takes effect immediately at the data boundary.

### Non-app (non-existing user) email recipients

**Decision: public-link-only.** If the invited email does not resolve to an
existing app user, the system sends that email the **public link** (subject to
the email abuse controls below). It does **not** create a claimable recipient
row, and it does **not** grant future account access if that person later signs
up with the same email. Account-recipient access requires an explicit invite to
an already-resolved user plus that user's acceptance.

### Live projection semantics

Recipient access is **live, not a snapshot**:

- An accepted recipient always sees the owner's **current** projected trip state.
- Owner edits are reflected immediately.
- **Owner revoke of the recipient invite**, or **trip deletion**, removes
  recipient access immediately.
- Account-recipient access is **independent of the public link lifecycle**:
  revoking, regenerating, or deleting the public share/QR link does **not** remove
  an accepted recipient's access. (DB: `trip_share_recipients.share_id` is
  `on delete set null`.)

### Recipient read path (critical boundary)

- Recipient trip reads go through an authenticated `shared-with-me` endpoint that
  loads the trip with the service role, validates `trip_data` with `TripSchema`,
  and returns **`projectPublicTrip(...)`** — the exact same public projection
  used by public links.
- The browser **never** receives a raw `trips` row for recipient views.
- No recipient `SELECT` policy is added to `public.trips`. Recipient association
  lives in `trip_share_recipients`, and the trip content is served only through
  the projecting endpoint.

## "Megosztva velem" dashboard

- The dashboard separates **Saját utazásaim**, **Megosztva velem** (accepted),
  and **Meghívások** (pending) — via tabs or a segmented control.
- Pending invites appear only under Meghívások with accept/decline actions; they
  never appear as accepted shared trips.
- Accepted shared trips open **read-only** (reuse the read-only context; no
  owner edit/delete/share controls appear).
- Recipient trips are kept in **separate state** from owned trips; they are never
  merged into the owned-trip list or written back.

## Profile QR (opt-in, rotatable)

Profile fields: `public_share_id text unique`, `profile_share_enabled boolean`,
`profile_share_rotated_at timestamptz`.

- **Opt-in:** profile QR is **disabled by default**. No scannable ID exists until
  the user enables it.
- **No email exposure:** the QR encodes a `public_share_id`-based URL, never the
  user's email or user id.
- **Rotatable:** the user can rotate `public_share_id`, immediately invalidating
  the previous target so old QRs stop resolving.
- **Disableable:** the user can disable profile sharing; a disabled or rotated QR
  cannot create new invites.
- **Scan only creates pending invites:** a scanned profile QR lets an owner
  create a **pending** invite to that user. It never grants accepted access on
  its own — the recipient still accepts.

## Email invites (provider + abuse controls)

Email sending must not ship until all of the following exist:

- **Provider:** a transactional provider (e.g. Resend or Postmark) with secrets
  stored **server-side only**. Missing provider env fails safely (no send, clear
  error).
- **Owner-gated:** only an authenticated owner of the trip can trigger an invite
  email.
- **Rate limited:** enforce server-side limits per owner and per trip. The
  endpoint cannot be used to send arbitrary or bulk email.
- **Content-safe:** the email contains only the intended recipient's link/invite
  content. It never contains `token_hash`, ciphertext, or private internals.
- **No enumeration:** invite/lookup responses do not reveal whether an arbitrary
  email or profile belongs to an existing user beyond what the flow requires.

## Harassment and abuse controls

- **Accept gate** (double consent) prevents unsolicited content from appearing in
  a recipient's dashboard.
- **Duplicate invites** to the same `(trip, recipient)` are constrained by a
  unique/partial index; repeated invites are deterministic no-ops or clear
  conflicts.
- **Cross-trip invite spam:** define at least one mitigation — e.g. a
  **per-recipient pending-invite cap** and/or an **owner-block** affordance so a
  recipient can stop a specific owner from sending further invites. (Exact
  mechanism finalized in the recipient endpoints task.)
- **Profile QR** rotation/disable lets a targeted user cut off a leaked QR.

## Threat model additions (beyond Phase 16)

### Encryption key compromise

Risk: the `SHARE_TOKEN_ENCRYPTION_KEY` leaks, allowing recovery of active public
links from a DB dump.

Controls: key is server-only, treated like the service-role secret; key
versioning enables rotation; blast radius is limited to read-only itinerary
links (public projection, no owner rights).

### Recipient privilege escalation

Risk: a recipient (or share/QR holder) gains owner or edit rights.

Controls: recipient reads are read-only public projections; no mutation endpoint
accepts a recipient association or a share token as authorization; owner actions
require owner JWT + trip ownership; recipient RLS never touches raw `trips`.

### Invite spam / harassment

Risk: an owner floods a user with invites, or a leaked profile QR is abused.

Controls: accept gate, duplicate constraint, per-recipient pending cap and/or
owner block, rotatable/disableable profile QR, email rate limits.

### User/profile enumeration

Risk: invite-by-email or profile-QR resolution leaks whether an account exists.

Controls: server-side resolution with generic responses; errors do not
distinguish "no such user" from other failures in a way that enables
enumeration; non-existing emails follow the public-link-only path without
confirming account existence.

### Claim-on-signup escalation

Risk: an email invite to a non-user silently becomes account access when that
person later registers with the same email.

Controls: **no email-only claimable recipient rows**; account-recipient access
requires an explicit invite to a resolved existing user plus acceptance.

## Required implementation decisions (summary)

- Public lookup stays hash-only; ciphertext exists only for owner-only,
  server-only re-display.
- No plaintext public share token is ever stored.
- No public or recipient `SELECT` policy is added to `public.trips`; recipient
  reads pass through `projectPublicTrip`.
- Recipient access requires owner invite **and** recipient acceptance (accept
  gate); pending invites never appear as accepted shared trips.
- Non-existing app user email recipients are **public-link-only**; no
  claim-on-signup access.
- Recipient views are **live projections**, not snapshots.
- Profile QR is opt-in, rotatable, and disableable; scans create pending invites
  only.
- Email sending requires provider + server-side rate limits + abuse controls, or
  it does not ship.
- At least one cross-trip invite-spam mitigation ships (per-recipient pending cap
  and/or owner block).
