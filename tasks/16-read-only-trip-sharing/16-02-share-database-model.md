# 16-02 — Share Database Model — DONE

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

- [x] Raw token is not stored in the database.
- [x] Share table is separate from trip domain JSON.
- [x] Indexes support token lookup and trip share management.
- [x] RLS does not expose other users' share rows.

## Output

- Added `supabase/migrations/005_trip_shares.sql`.
- Created `public.trip_shares` with `trip_id`, `token_hash`, `created_by`, lifecycle timestamps, foreign keys, expiry/revoke checks, and a unique token hash constraint.
- Added indexes for token lookup, owner trip share management, active share listing, and creator filtering.
- Enabled RLS and added owner-scoped policies for select/insert/update/delete without exposing other users' share rows.
- Granted access only to authenticated and service role clients; no anonymous table grant or public trip policy was added.
