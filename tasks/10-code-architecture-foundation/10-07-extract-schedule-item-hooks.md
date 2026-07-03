# 10-07 — Extract ScheduleItem Hooks

Read only:

- `src/components/ScheduleItem.jsx`
- `src/hooks/`
- `src/lib/`
- `src/components/editor/`

Goal: reduce `ScheduleItem.jsx` by extracting stateful workflows and pure helpers.

Requirements:

1. Move URL/location parsing helper to `src/lib/` if appropriate.
2. Extract copy-to-clipboard state into a hook if practical.
3. Extract schedule item editor draft/dirty/validation workflow into a hook if practical.
4. Preserve:
   - edit/save/cancel
   - dirty cancel confirmation
   - copy feedback
   - AI guide/apply behavior
   - readOnly behavior
5. Do not change rendered behavior.
6. Keep the component below the target size if practical.

Manual test flow to report:

- Edit a schedule item.
- Cancel dirty edit and confirm warning.
- Copy location.
- Apply AI guide suggestion or describe if AI env unavailable.
- Confirm readOnly mode still hides editor controls.
- Run `pnpm run build`.

Do not write automated tests.
