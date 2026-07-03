# 10-11 — File Size Reduction Pass

Read only:

- files identified in the large-file audit
- `src/hooks/`
- `src/components/`
- `src/lib/`

Goal: bring priority files closer to the target size without changing behavior.

Requirements:

1. Focus only on files marked priority in `10-02`.
2. Prefer extracting:
   - hooks for stateful workflow logic
   - child components for repeated UI blocks
   - pure helpers for transformations
3. Do not combine unrelated refactors.
4. Keep every new file focused.
5. Do not change UI design.
6. Do not change data shape.
7. Document any file still above 250 lines and why.

Manual test flow to report:

- Run the file-size command again.
- Smoke test affected flows.
- Run `pnpm run build`.

Do not write automated tests.
