# 19-06 — Production Cutover And Rollback Window

**Estimate:** 2-3 hours plus an observation period

## Goal

Switch production to the self-host stack, with a tested rollback path and the
managed project kept intact.

This is migration sequence steps 9-10 from the audit. It is the first task in
this phase that changes production.

## Prerequisites

19-02 through 19-05 complete, with 19-04 restore verified and 19-05 fully
passing. Do not start otherwise.

## Scope

- Announce the cutover window. Every session will be invalidated because the JWT
  secret changes; all users must log in again.
- Freeze writes, take a final delta dump, restore it.
- Switch DNS and environment variables:
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`.
- Carry `SHARE_TOKEN_ENCRYPTION_KEY` unchanged.
- Reconfigure GoTrue `SITE_URL` and redirect allow list to match
  `docs/architecture/AUTH_SETUP.md`.
- Keep the managed project alive and paid for the full rollback window.
- Remove the 19-02 keepalive only after the managed project is retired.

## Rollback

Revert the four environment variables to the managed values and redeploy. Users
log in again. The cost is any data written to self-host after cutover, so keep
the window short.

## Acceptance Criteria

- Production runs on the self-host stack.
- A rollback has been rehearsed, not just documented.
- The managed project is not deleted.
- Scheduled backups with retention are running against the new stack.
- `docs/architecture/AUTH_SETUP.md` is updated to describe the self-host
  configuration.

## Output

Pending.
