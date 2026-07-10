# 12-06 — Browser Storage Validation ✅ DONE

**Estimate:** 1–2 hours
**Note:** Minimal surface — only sessionStorage admin flag with strict `=== '1'` check, already fail-closed.

## Goal

Validate every value read from browser-managed storage.

## Scope

- `src/schemas/auth.ts`
- `src/schemas/storage.ts`
- Admin session context/hooks
- Any `localStorage` or `sessionStorage` consumer

Inventory storage keys before editing. Do not add persistence that does not
already exist.

## Acceptance Criteria

- Every storage read starts as `string | null`, then parses to `unknown`.
- JSON storage values use named Zod schemas.
- Invalid, expired, or version-mismatched values are cleared safely.
- Admin lock defaults to locked for missing or invalid state.
- Storage keys and schema versions remain centralized constants.

## Review Checklist

- [ ] No direct `JSON.parse` result reaches domain/application state.
- [ ] Corrupt storage cannot break initial render.
- [ ] Security-sensitive state fails closed.
- [ ] Storage schema changes are versioned where needed.
- [ ] No new secret is stored in the browser.

