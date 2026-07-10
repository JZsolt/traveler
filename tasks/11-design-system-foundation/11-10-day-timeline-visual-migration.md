# 11-10 — Day Timeline Visual Migration ✅ DONE

Read only:

- `docs/design/VISUAL_LANGUAGE.md`
- `docs/design/ICON_SYSTEM.md`
- `src/components/DaySection.tsx`
- `src/components/ScheduleItem.tsx`
- `src/components/GuideInfo.tsx`
- `src/components/ui/Timeline.tsx`
- `src/components/ui/`

Goal: migrate day schedule visuals to the timeline primitive without changing schedule behavior.

Requirements:

1. Use the timeline primitive for schedule display where practical.
2. Preserve:
   - schedule edit
   - move up/down
   - delete
   - AI guide/apply flow
   - pending AI schedule draft behavior
   - dirty-state confirmation
3. Preserve mobile readability.
4. Do not change trip data shape.
5. Do not change AI endpoint behavior.
6. Update `docs/design/IMPLEMENTATION_PLAN.md` Phase 6 status when complete.

Manual test flow to report:

- Expand a day.
- Edit one schedule item.
- Move one schedule item.
- Apply then discard an AI schedule draft.
- Confirm guide details still open.
- Run `pnpm run build`.

Do not write automated tests.
