# 19-04 — Full Backup And Restore Rehearsal

**Estimate:** 2-3 hours

## Goal

Produce a genuine full backup of the managed project and prove it restores,
before any cutover is considered.

This is migration sequence steps 5-6 from the audit.

## Context

The existing GitHub backup exports `trip_data` only. It does not contain
`auth.users`, `profiles`, `trip_shares`, `trip_share_recipients` or
`trip_invite_email_events`. It is a content backup, not a system backup, and
must not be treated as a migration safety net.

## Scope

- Take a full logical dump including the `auth` schema, roles and grants.
- Take a `public`-only dump as a convenience restore target.
- Restore the full dump into the self-host stack from 19-03.
- Confirm restore ordering: the `auth` schema must exist before the
  `on_auth_user_created` trigger from migration 002 is restored.
- Verify row counts per table against the source.
- Use `pnpm run backup:db` (`scripts/backup-supabase-full.sh`). It dumps both
  schemas, records row counts, prunes to the newest `KEEP` sets (default 7) and
  prints disk usage afterwards.

## Acceptance Criteria

- The restored database contains every account, profile, share, recipient and
  invite event present in the source.
- New signups on the restored stack create a profile row, proving the
  `auth.users` trigger survived.
- Retention is active, so dumps cannot fill the host disk.
- No secret value is written into the repository.
- Production remains live and untouched throughout.

## Backup Location Decision (2026-09-09)

Dumps stay **on the ThinkCentre for now**, because no other target is available
yet. This is an accepted risk, recorded rather than hidden.

Why the exposure is narrower than it looks: trip content already has an
off-host copy in the GitHub trip backup. What this dump uniquely protects is
`auth.users`, `profiles`, `trip_shares`, `trip_share_recipients` and
`trip_invite_email_events`. If the host is lost, trips survive, but every
account and every share link is gone and 10-20 users would have to register
again and re-share.

Consequences that are now mandatory rather than optional:

- Retention is enforced by the script (newest 7 sets), because the host disk is
  already ~72% full and unbounded dumps would fill it.
- Dumps must be written outside any Docker volume path, so a volume removal
  cannot take the backups with it.
- Copy a dump set off-host opportunistically whenever a target is available.

Revisit this when an off-host target exists, and again before 20-11 if the
product ever has paying users.

## Output

Pending.
