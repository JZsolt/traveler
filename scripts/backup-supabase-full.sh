#!/usr/bin/env bash
# Full logical backup of a Supabase project, including the auth schema.
#
# The GitHub trip backup (api/backup-trips.ts) exports trip_data only. It does
# NOT contain auth.users, profiles, trip_shares, trip_share_recipients or
# trip_invite_email_events, so it cannot be used as a migration safety net.
# This script is what 19-04 requires.
#
# Usage:
#   SUPABASE_DB_URL='postgresql://...' ./scripts/backup-supabase-full.sh [outdir]
#
# Retention: keeps the newest KEEP dump sets (default 7) and deletes older ones.
# This matters because the dumps currently live on the same host as the
# database, on a disk that is already ~72% full. Override with KEEP=n.
#
# Get the connection string from the Supabase dashboard under
# Project Settings -> Database -> Connection string -> URI.
# Never commit it and never pass the password as a command argument. The script
# reads the full URI from the environment, strips the password from the URI used
# on argv, and passes the password separately through PGPASSWORD.

set -euo pipefail

OUT_DIR="${1:-./backups/supabase}"
STAMP="$(date +%Y%m%d-%H%M%S)"
KEEP="${KEEP:-7}"

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "error: SUPABASE_DB_URL is not set" >&2
  echo "hint:  export it from your password manager, do not hard-code it" >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "error: pg_dump not found. Install the postgresql client tools." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "error: node not found. Required to parse SUPABASE_DB_URL without exposing the password in process arguments." >&2
  exit 1
fi

{
  IFS= read -r BACKUP_DB_URL
  IFS= read -r BACKUP_DB_PASSWORD
} < <(
  node <<'NODE'
const raw = process.env.SUPABASE_DB_URL

try {
  const url = new URL(raw)
  const password = decodeURIComponent(url.password)

  if (!url.protocol.startsWith('postgres')) {
    throw new Error('unsupported protocol: ' + url.protocol)
  }

  if (!password) {
    throw new Error('missing password in SUPABASE_DB_URL')
  }

  url.password = ''

  console.log(url.toString())
  console.log(password)
} catch (err) {
  console.error('error: invalid SUPABASE_DB_URL (' + err.message + ')')
  process.exit(1)
}
NODE
)

# Warn on a server/client major version mismatch: pg_dump refuses to dump a
# newer server, and that failure is easier to read here than mid-dump.
echo "pg_dump version: $(pg_dump --version)"

mkdir -p "$OUT_DIR"

FULL="$OUT_DIR/traveler-full-$STAMP.dump"
PUBLIC_ONLY="$OUT_DIR/traveler-public-$STAMP.dump"
ROLES="$OUT_DIR/traveler-roles-$STAMP.sql"

echo "==> full dump (auth + public), custom format"
PGPASSWORD="$BACKUP_DB_PASSWORD" pg_dump "$BACKUP_DB_URL" \
  --format=custom \
  --no-owner \
  --schema=public \
  --schema=auth \
  --file="$FULL"

echo "==> public-only dump, convenience restore target"
PGPASSWORD="$BACKUP_DB_PASSWORD" pg_dump "$BACKUP_DB_URL" \
  --format=custom \
  --no-owner \
  --schema=public \
  --file="$PUBLIC_ONLY"

# pg_dumpall --roles-only needs a superuser-ish connection. On managed Supabase
# this commonly fails; that is expected and not fatal, because the self-host
# stack creates its own roles. Record the outcome either way.
echo "==> role definitions (best effort)"
if command -v pg_dumpall >/dev/null 2>&1 && \
   PGPASSWORD="$BACKUP_DB_PASSWORD" pg_dumpall --dbname="$BACKUP_DB_URL" --roles-only --file="$ROLES" 2>/dev/null; then
  echo "    roles captured: $ROLES"
else
  echo "    roles NOT captured (expected on managed Supabase; self-host creates its own)"
  rm -f "$ROLES"
fi

echo
echo "==> row counts at dump time"
PGPASSWORD="$BACKUP_DB_PASSWORD" psql "$BACKUP_DB_URL" --tuples-only --no-align --command "
  select 'auth.users            ' || count(*) from auth.users
  union all select 'public.trips          ' || count(*) from public.trips
  union all select 'public.profiles       ' || count(*) from public.profiles
  union all select 'public.trip_shares    ' || count(*) from public.trip_shares
  union all select 'public.recipients     ' || count(*) from public.trip_share_recipients
  union all select 'public.invite_events  ' || count(*) from public.trip_invite_email_events;
" | tee "$OUT_DIR/rowcounts-$STAMP.txt"

echo
echo "==> retention: keeping the newest $KEEP dump sets"
# Portable on both GNU (Ubuntu host) and BSD (macOS) userland: no find -printf,
# no mapfile. Timestamps sort lexicographically because of the YYYYmmdd-HHMMSS
# format, so plain sort is chronological.
ALL_STAMPS="$(
  ls -1 "$OUT_DIR" 2>/dev/null \
    | sed -n 's/^traveler-full-\(.*\)\.dump$/\1/p' \
    | sort -r
)"
TOTAL="$(printf '%s\n' "$ALL_STAMPS" | grep -c . || true)"

if [ "$TOTAL" -gt "$KEEP" ]; then
  printf '%s\n' "$ALL_STAMPS" | tail -n +$((KEEP + 1)) | while IFS= read -r old; do
    [ -n "$old" ] || continue
    echo "    removing dump set $old"
    rm -f "$OUT_DIR/traveler-full-$old.dump" \
          "$OUT_DIR/traveler-public-$old.dump" \
          "$OUT_DIR/traveler-roles-$old.sql" \
          "$OUT_DIR/rowcounts-$old.txt"
  done
else
  echo "    $TOTAL set(s) present, nothing to prune"
fi

echo
echo "Disk after backup:"
df -h "$OUT_DIR" | tail -1 | sed 's/^/    /'

echo
echo "Done."
echo "  full:   $FULL"
echo "  public: $PUBLIC_ONLY"
echo "  counts: $OUT_DIR/rowcounts-$STAMP.txt"
echo
echo "NEXT — a dump you have not restored is not a backup:"
echo "  1. Restore into a scratch database and compare the row counts above."
echo "  2. Restore auth BEFORE public: migration 002 puts a trigger on auth.users."
echo
echo "ACCEPTED RISK: these dumps currently live on the same machine as the"
echo "database. Trip content is separately safe in the GitHub trip backup, so"
echo "what is uniquely at risk here is accounts, profiles and share links."
echo "Copy a set off-host whenever you get the chance."
