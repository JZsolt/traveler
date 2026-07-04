# 10-03 — Constants Inventory ✅ DONE

Read only:

- `src/`
- `api/`
- `docs/architecture/ARCHITECTURE.md`

Goal: identify magic strings and values that should become shared constants.

Requirements:

1. Audit route paths, API paths, storage keys, section keys, model ids, error codes, and repeated UI labels.
2. Add a concise constants inventory to `docs/architecture/ARCHITECTURE.md`.
3. Recommend target files, for example:
   - `src/lib/routes.js`
   - `src/lib/apiPaths.js`
   - `src/lib/storageKeys.js`
   - `src/lib/tripSectionKeys.js`
   - `src/lib/aiModels.js`
   - `src/lib/messages.js`
4. Do not create constants files yet.
5. Do not refactor code in this task.

Manual test flow to report:

- Report the top repeated constants found.
- Confirm no application code changed.
- Run `pnpm run build`.

Do not write automated tests.
