# 12-10 — Runtime Validation Final Review ✅ DONE

**Estimate:** 2 hours

## Goal

Prove that all external data boundaries validate before domain use and close
the phase only when no unsafe path remains.

## Scope

- `src/`
- `api/`
- `src/schemas/`
- `src/types/`
- Runtime-validation documentation and roadmap

## Acceptance Criteria

- Boundary inventory covers AI, Supabase, browser storage, URL params, imported
  JSON, backup files, and external API JSON.
- Every boundary maps to a named Zod schema and owner.
- Schema/type duplication audit is clean.
- Invalid-input behavior is documented for each boundary.
- No unsafe cast or raw external payload reaches domain logic.
- Phase 12 and roadmap are marked done only after all checks pass.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run validate:trips
pnpm run validate:trips:strict
```

## Review Checklist

- [x] All Phase 12 subtasks are marked done.
- [x] Schema files remain focused and within size limits.
- [x] Valid legacy backups and current Supabase trips remain compatible.
- [x] User-visible validation errors are safe and Hungarian.
- [x] No secrets or raw personal data appear in logs.
- [x] Design-system phase is unblocked only after this review.
- [x] useTripUpdater blocks saves on validation failure (not warn-only).
- [x] validateTripJson no longer bypasses validation when normalized has slug.
- [x] Frontend AI response envelopes use Zod schemas (ChatReplyEnvelopeSchema, etc.).
- [x] All Supabase writes validate data with schema before insert/update.
- [x] Backup read path validates trip_data before export, reports skipped trips.
- [x] Backup schema: version/schema as number, exportedAt as datetime (required).
- [x] Section configs use sectionConfig() factory — formatters receive typed data, no casts.
- [x] auth.ts and storage.ts schemas created and used (AdminContext validates storage).
- [x] guards.ts uses Zod schemas from src/schemas/ (no inline schema definitions).
- [x] useDayAdvancedEditor uses Object.fromEntries — no Record cast.
- [x] DaySection and ScheduleItem inline guards replaced with shared guards.
- [x] suggest-trip-section uses SuggestSectionRequestSchema for request body.
- [x] GitHub API responses validated with GitHubContentSchema/GitHubCommitResultSchema.
- [x] API response schemas moved to src/schemas/apiResponses.ts (schema ownership).
- [x] BackupResultSchema: skippedCount/skippedSlugs required, exportedAt datetime, commitSha/Url nullable.
- [x] BackupResult type uses z.infer (no manual duplication).
- [x] BackupButton UI checks skippedCount for partial state, displays skipped trips.
- [x] Manifest built from valid rows only; malformed rows reported in skippedSlugs.
- [x] Backup exports Zod-parsed trip_data, not raw Supabase data.
- [x] Supabase rows validated with SupabaseTripRowSchema; malformed rows tracked and reported.
- [x] No `as SupabaseTripRow` cast; uses z.infer<typeof SupabaseTripRowSchema> throughout.
- [x] Backup output validated with TripBackupEnvelopeSchema; error message sanitized.
- [x] GitHub malformed commit response treated as failure (not ok:true with null).
- [x] sectionConfig uses SectionConfigOptions type (no inline type, no `as` cast).
- [x] sectionConfig.format throws on re-validation failure instead of silent null.
- [x] Manifest title extraction uses Zod schema (TripTitleSchema) instead of manual narrowing.
- [x] buildBackupFiles allRows param removed; manifest only includes exported trips.
- [x] useDayScheduleAi: removed `as ScheduleAiPreview` cast, added error on invalid 200.
- [x] useCreateTripChat: added error on invalid 200 chat response.
- [ ] Runtime schema tests — deferred: no test framework installed yet.
