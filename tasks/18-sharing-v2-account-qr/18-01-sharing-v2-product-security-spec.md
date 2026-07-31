# 18-01 — Sharing V2 Product And Security Spec — DONE

**Estimate:** 1-2 hours

## Goal

Define the final UX, data boundaries, and threat model for persistent public
links, QR sharing, account recipients, profile QR, and email invites.

## Scope

- Public link + QR UX.
- Active link re-display behavior.
- Account-to-account sharing states.
- Pending/accepted/revoked recipient lifecycle.
- "Megosztva velem" dashboard behavior.
- Profile QR privacy controls.
- Email abuse/rate-limit requirements.
- Non-app recipient email lifecycle decision:
  - Email to a non-existing app user sends a public/invite link only.
  - No account recipient membership is auto-claimed later by email match unless
    a separate claim flow is explicitly designed.
- Live recipient access semantics:
  - Accepted recipients see the owner's current projected trip state.
  - Owner edits, revoke, trip delete, or share delete take effect immediately.
- Explicit public projection rules for recipients.
- Harassment controls for repeated pending invites.

## Acceptance Criteria

- Spec clearly separates public link sharing from account recipient sharing.
- Spec states that recipient reads never use raw `trips.trip_data` directly.
- Spec defines pending invite acceptance before dashboard inclusion.
- Spec defines profile QR opt-in, disable, and rotate behavior.
- Spec defines email provider/rate-limit requirements before email sending.
- Spec decides whether non-app email recipients are public-link-only or
  claimable account invites; default is public-link-only.
- Spec states that recipient views are live projections, not snapshots.
- Spec defines at least one mitigation for invite spam across many trips, for
  example per-recipient pending invite caps or owner blocking.

## Review Checklist

- [x] No design requires a public `trips` SELECT policy. (Recipient reads go
      through `projectPublicTrip`; stated in "Two sharing modes", "Recipient read
      path", and "Required implementation decisions".)
- [x] No design stores plaintext public share tokens. (Hash-only lookup +
      owner-only ciphertext; "Public link persistence and token storage".)
- [x] Spam/harassment risks are explicitly addressed. (Accept gate, duplicate
      constraint, per-recipient pending cap / owner block, rotatable profile QR,
      email rate limits — "Harassment and abuse controls" + threat model.)
- [x] Non-existing app user email invites cannot silently create future account
      access by email match. ("Non-app email recipients" + "Claim-on-signup
      escalation" — public-link-only, no email-only claimable rows.)
- [x] The simplest owner/viewer UX is documented. (One link/QR for everyone;
      modal primary state; two-mode table.)

## Output

- `docs/architecture/SHARING_V2_SPEC.md` — extends `SHARING_SPEC.md` (Phase 16).
  Covers: two separate sharing modes (public link vs account recipient); persistent
  public link storage (hash-only lookup + AES-GCM `token_ciphertext` +
  `token_key_version`, owner/server-only decryption, honest key-leak trade-off,
  legacy Phase-16 fallback → regenerate); QR UX; recipient lifecycle with accept
  gate; non-app email = public-link-only (no claim-on-signup); live-not-snapshot
  recipient views; recipient read path via `projectPublicTrip` (no public/recipient
  `trips` SELECT policy); "Megosztva velem" dashboard; opt-in/rotatable/disableable
  profile QR; email provider + rate-limit + abuse controls; expanded threat model.
- Docs-only task — no app code changed. Full quality gate rerun and green:
  `pnpm run lint` clean, `tsc --noEmit` 0, `pnpm build` OK, 151 tests pass.
