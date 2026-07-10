# 11-06 — Timeline Primitives

Read only:

- `docs/design/COMPONENT_SPEC.md`
- `docs/design/VISUAL_LANGUAGE.md`
- `src/components/ScheduleItem.tsx`
- `src/components/DaySection.tsx`
- `src/components/ui/`
- `src/lib/utils.ts`

Goal: add reusable timeline display primitives while preserving current schedule behavior.

Requirements:

1. Add `src/components/ui/Timeline.tsx`.
2. Export `Timeline` and `TimelineItem` from that file.
3. Support:
   - time
   - title
   - description
   - badges
   - highlight
   - actions slot
4. Keep the primitive presentational only.
5. Do not migrate `DaySection` or `ScheduleItem` in this task.
6. Update `docs/design/COMPONENT_SPEC.md` statuses.

Manual test flow to report:

- Import check by running build.
- Confirm no schedule rendering changed yet.
- Run `pnpm run build`.

Do not write automated tests.
