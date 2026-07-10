# 13-03 — Runtime Schema Tests

**Estimate:** 2-3 hours

## Goal

Add focused tests for the highest-risk Zod schemas.

## Scope

- `src/schemas/`
- Test files for schema behavior
- Test fixtures local to tests

Do not change production schemas unless a test exposes a real bug.

## Acceptance Criteria

- `TripSchema` accepts a valid minimal full trip.
- `TripImportDataSchema` accepts valid import data and rejects missing required
  import fields.
- AI envelope schemas reject malformed successful responses.
- Backup/import response schemas cover success, partial, and invalid shapes.
- GitHub and Supabase response schemas reject malformed external payloads.
- Tests assert parsed data where normalization/coercion is expected.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Tests import schemas from `src/schemas/`, not duplicated validators.
- [ ] Invalid fixtures use `unknown` inputs where practical.
- [ ] Tests cover both accept and reject paths.
- [ ] Tests do not depend on network, Supabase, Gemini, or GitHub.
- [ ] Schema changes, if any, are justified by test failures.
