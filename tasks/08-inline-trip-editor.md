# 08 — Inline Trip Editor And Section AI

This is the index for the inline editor phase.

Claude must not implement this whole phase at once. Open and implement exactly one task file from `tasks/08-inline-trip-editor/`, then stop.

## Global Rules

- Read `tasks/PROJECT_RULES.md`.
- Read this index.
- Read only the one current task file.
- Read only files listed in that task's `Read only` section.
- Do not read generated output, backups, `_bmad-output`, or unrelated task files.
- Keep every diff small.
- Preserve unknown fields in `trip_data`.
- Keep Supabase as source of truth.
- Never expose server secrets to frontend.
- AI output must be previewed/applied by the user before Save.
- AI must never auto-save.
- AI/token/rate-limit/invalid-JSON/network errors must be visible in the UI with useful Hungarian messages.
- Console logs may exist only as extra debug detail, never as the only error surface.
- Do not create automated tests unless a task explicitly asks for them.
- Every final summary must include a manual test flow for the user.
- Run `pnpm run build`.

## Manual Test Flow Expectations

For UI tasks, summarize how the user can manually verify:

- desktop render still works
- iPhone 12 mini width has no overflow
- edit opens/closes
- Cancel does not persist
- Save persists only the intended section
- errors are visible in UI

For AI tasks, summarize manual flows for:

- happy path
- missing API key/server error
- 429/rate limit
- token limit/truncated response
- invalid JSON/invalid shape
- retry with shorter prompt or different model

## Task Order

1. ~~`08-01-trip-updater.md`~~ ✅
2. ~~`08-02-section-helpers.md`~~ ✅
3. ~~`08-03-editable-section-shell.md`~~ ✅
4. ~~`08-04-packing-list-editor.md`~~ ✅
5. ~~`08-05-useful-links-editor.md`~~ ✅
6. ~~`08-06-saving-tips-editor.md`~~ ✅
7. ~~`08-07-booking-checklist-editor.md`~~ ✅
8. ~~`08-08-practical-info-editor.md`~~ ✅
9. ~~`08-09-hero-basic-editor.md`~~ ✅
10. ~~`08-10-accommodation-editor.md`~~ ✅
11. ~~`08-11-flight-editor.md`~~ ✅
12. ~~`08-12-budget-editor.md`~~ ✅
13. ~~`08-13-day-metadata-editor.md`~~ ✅
14. ~~`08-14-day-list-controls.md`~~ ✅
15. ~~`08-15-day-advanced-json-editor.md`~~ ✅
16. ~~`08-16-schedule-basic-editor.md`~~ ✅
17. ~~`08-17-schedule-list-controls.md`~~ ✅
18. ~~`08-18-schedule-details-editor.md`~~ ✅
19. ~~`08-19-ai-endpoint-skeleton.md`~~ ✅
20. ~~`08-20-ai-endpoint-packing-list.md`~~ ✅
21. ~~`08-21-ai-ui-packing-list.md`~~ ✅
22. ~~`08-22-ai-simple-sections.md`~~ ✅
23. ~~`08-23-ai-day-and-guide.md`~~ ✅
24. ~~`08-24-polish-docs-and-validation.md`~~ ✅
