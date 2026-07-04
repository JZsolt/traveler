# 10-09 — Centralize Constants And Contract Copy ✅ DONE

Read only:

- `src/`
- `api/`
- audit notes from `docs/architecture/ARCHITECTURE.md`

Goal: move contract-level constants out of JSX/API implementation files.

Requirements:

1. Create small constants files only where useful.
2. Centralize:
   - route paths
   - API endpoint paths
   - session storage keys
   - AI model ids
   - trip section keys
   - reusable error codes/messages
3. Do not move every one-off UI label into global constants.
4. Preserve all behavior.
5. Avoid circular imports.
6. Keep constants names explicit.

Manual test flow to report:

- Navigate key routes.
- Trigger one API-backed flow or describe if env unavailable.
- Confirm session storage behavior if admin phase is complete.
- Run `pnpm run build`.

Do not write automated tests.
