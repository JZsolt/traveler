# 12-08 — Import And Export Validation ✅ DONE

**Estimate:** 2–3 hours

## Goal

Use versioned Zod schemas for JSON import, backup restore, and exported data.

## Scope

- `src/schemas/storage.ts`
- `src/lib/validateTripJson.ts`
- Import hooks/components
- `api/_import-utils.ts`
- `api/_backup-utils.ts`
- Export helpers

## Acceptance Criteria

- Direct JSON import and GitHub backup envelopes have named schemas.
- Browser and server import paths use the same schema ownership.
- Backup version and application fields are validated.
- Supported legacy backups are migrated explicitly.
- Export output is validated before download or GitHub commit.
- Invalid files return path-aware Hungarian errors without partial mutation.

## Review Checklist

- [ ] Every `JSON.parse` import result remains `unknown` until parsed.
- [ ] Batch import isolates invalid files and reports their filenames/indexes.
- [ ] Create and upsert-by-slug semantics are unchanged.
- [ ] Backup round-trip preserves valid trip data.
- [ ] No frontend bundle imports server secrets or server-only modules.

