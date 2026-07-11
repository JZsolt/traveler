# 16-02 — Share Database Model

**Estimate:** 1-3 hours

## Goal

Add a separate share table for revocable public links.

## Scope

- `trip_shares`
- `id uuid`
- `trip_id uuid`
- `token_hash text`
- `created_by uuid`
- `created_at`
- `expires_at null`
- `revoked_at null`
- Indexes and constraints
- RLS/policy strategy for owner-managed shares

## Acceptance Criteria

- Token hash is unique.
- Share rows link to trips and creator.
- Owner can manage shares for own trips only.
- Revoked/expired links are representable.

## Review Checklist

- [ ] Raw token is not stored in the database.
- [ ] Share table is separate from trip domain JSON.
- [ ] Indexes support token lookup and trip share management.
- [ ] RLS does not expose other users' share rows.
