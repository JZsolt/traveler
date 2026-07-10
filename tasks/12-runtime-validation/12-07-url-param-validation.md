# 12-07 — URL Parameter Validation ✅ DONE

**Estimate:** 1–2 hours

## Goal

Validate route parameters and URL-derived values before domain workflows use
them.

## Scope

- `src/schemas/route.ts`
- Route pages using `useParams`
- Navigation helpers consuming slugs

## Acceptance Criteria

- Trip slug parameters are parsed with a shared schema.
- Missing, malformed, oversized, or unsafe slugs follow one redirect/error
  policy.
- Hooks receive a validated slug or an explicit absence state.
- URL values are never cast to required route types.
- Valid existing links and redirects behave unchanged.

## Review Checklist

- [ ] Every `useParams` call is inventoried.
- [ ] Slug constraints match creation/import behavior.
- [ ] Validation happens before Supabase queries and mutations.
- [ ] Invalid routes do not trigger network mutations.
- [ ] No duplicated slug regex exists.
