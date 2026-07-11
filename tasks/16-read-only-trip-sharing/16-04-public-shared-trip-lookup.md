# 16-04 — Public Shared Trip Lookup

**Estimate:** 2-3 hours

## Goal

Allow anonymous lookup of an active shared trip by token.

## Scope

- `/api/share/:token` or equivalent endpoint/RPC.
- Hash incoming token.
- Lookup active share.
- Join/load trip safely.
- Return only public projection.
- Invalid, expired, and revoked states.

## Acceptance Criteria

- Anonymous user cannot query `trips` directly.
- Random token returns controlled not-found response.
- Revoked/expired token returns controlled invalid response.
- Active token returns safe public trip projection.

## Review Checklist

- [ ] No `supabase.from('trips').select('*')` public policy is added.
- [ ] Token input is treated as `unknown` and schema-validated.
- [ ] Raw trip row does not reach response formatting unvalidated.
- [ ] Errors do not reveal whether a private trip exists.
