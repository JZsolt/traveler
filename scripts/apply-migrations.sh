#!/usr/bin/env bash
# Apply supabase/migrations/*.sql in order, then run the structural half of
# supabase/verify_rls_policies.sql as automated assertions.
#
# Intended for a FRESH, EMPTY database: a new self-host stack (19-03) or a
# scratch restore target (19-04).
#
# NOT idempotent. 001_create_trips.sql creates a policy and a trigger without
# "if not exists" guards, so re-running it against a partially migrated
# database fails. Later migrations are mostly guarded, but do not rely on it.
# Use --verify-only against a database that is already migrated.
#
# Usage:
#   PGURL='postgresql://postgres:...@localhost:5432/postgres' \
#     ./scripts/apply-migrations.sh
#
#   ./scripts/apply-migrations.sh --verify-only   # skip apply, just assert
#
# Sections 5-9 of verify_rls_policies.sql need two real users and are NOT
# covered here. That is task 19-05 (which absorbs 18-13).

set -euo pipefail

VERIFY_ONLY=0
[[ "${1:-}" == "--verify-only" ]] && VERIFY_ONLY=1

if [[ -z "${PGURL:-}" ]]; then
  echo "error: PGURL is not set" >&2
  exit 1
fi

command -v psql >/dev/null 2>&1 || { echo "error: psql not found" >&2; exit 1; }

MIGRATIONS_DIR="$(dirname "$0")/../supabase/migrations"
FAILED=0

run_sql() { psql "$PGURL" --tuples-only --no-align --quiet --command "$1"; }

assert_eq() {
  local label="$1" expected="$2" actual="$3"
  if [[ "$actual" == "$expected" ]]; then
    printf '  PASS  %-46s %s\n' "$label" "$actual"
  else
    printf '  FAIL  %-46s expected=%s actual=%s\n' "$label" "$expected" "$actual"
    FAILED=1
  fi
}

if [[ $VERIFY_ONLY -eq 0 ]]; then
  echo "==> applying migrations"
  shopt -s nullglob
  for f in "$MIGRATIONS_DIR"/*.sql; do
    echo "    $(basename "$f")"
    psql "$PGURL" --quiet --set ON_ERROR_STOP=1 --file "$f" >/dev/null
  done
  shopt -u nullglob
  echo
fi

echo "==> structural verification (verify_rls_policies.sql sections 1-4, 10)"

assert_eq "RLS enabled on trips" "t" \
  "$(run_sql "select rowsecurity from pg_tables where schemaname='public' and tablename='trips'")"

assert_eq "owner-scoped policies on trips" "4" \
  "$(run_sql "select count(*) from pg_policies where schemaname='public' and tablename='trips'")"

assert_eq "legacy permissive policies removed" "0" \
  "$(run_sql "select count(*) from pg_policies where schemaname='public' and tablename='trips' and policyname='Trips are publicly readable'")"

assert_eq "trips.owner_id is NOT NULL" "NO" \
  "$(run_sql "select is_nullable from information_schema.columns where table_schema='public' and table_name='trips' and column_name='owner_id'")"

assert_eq "composite unique index owner_id+slug" "1" \
  "$(run_sql "select count(*) from pg_indexes where schemaname='public' and indexname='idx_trips_owner_slug'")"

echo
echo "==> object inventory (migrations 002-010)"

assert_eq "application tables present" "5" \
  "$(run_sql "select count(*) from information_schema.tables where table_schema='public' and table_name in ('trips','profiles','trip_shares','trip_share_recipients','trip_invite_email_events')")"

assert_eq "RLS enabled on all 5 tables" "5" \
  "$(run_sql "select count(*) from pg_tables where schemaname='public' and rowsecurity and tablename in ('trips','profiles','trip_shares','trip_share_recipients','trip_invite_email_events')")"

assert_eq "handle_new_user() exists" "1" \
  "$(run_sql "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='handle_new_user'")"

# The auth.users trigger is the migration-order trap: if auth.users did not
# exist when 002 ran, everything else looks healthy but new signups create no
# profile row.
assert_eq "on_auth_user_created trigger on auth.users" "1" \
  "$(run_sql "select count(*) from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='auth' and c.relname='users' and t.tgname='on_auth_user_created'")"

assert_eq "resolve_user_id_by_email() exists" "1" \
  "$(run_sql "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='resolve_user_id_by_email'")"

assert_eq "resolve_user_id_by_email NOT executable by anon" "f" \
  "$(run_sql "select has_function_privilege('anon','public.resolve_user_id_by_email(text)','execute')")"

assert_eq "resolve_user_id_by_email NOT executable by authenticated" "f" \
  "$(run_sql "select has_function_privilege('authenticated','public.resolve_user_id_by_email(text)','execute')")"

# NOTE: we deliberately do NOT assert that anon lacks the SELECT privilege.
# Supabase grants table privileges to anon/authenticated by default, and
# CLAUDE.md's setup steps grant SELECT on trips to anon explicitly. Security
# comes from RLS: after migration 004 every policy requires auth.uid() =
# owner_id, so anon matches no rows and gets an empty result, not an error.
# The property worth asserting is therefore about policies, not privileges.
assert_eq "no permissive USING(true) policy on trips" "0" \
  "$(run_sql "select count(*) from pg_policies where schemaname='public' and tablename='trips' and qual='true'")"

assert_eq "all trips policies are owner-scoped" "4" \
  "$(run_sql "select count(*) from pg_policies where schemaname='public' and tablename='trips' and (coalesce(qual,'') like '%owner_id%' or coalesce(with_check,'') like '%owner_id%')")"

# Postgres applies table privileges BEFORE RLS, so a correct policy on a table
# the role cannot touch still denies access. Migration 012 grants these; the
# assertion catches a stack where 012 did not run.
assert_eq "authenticated CAN select trips (grant present)" "t" \
  "$(run_sql "select has_table_privilege('authenticated','public.trips','select')")"

assert_eq "authenticated CAN insert trips (grant present)" "t" \
  "$(run_sql "select has_table_privilege('authenticated','public.trips','insert')")"

echo
if [[ $FAILED -ne 0 ]]; then
  echo "RESULT: FAILED — do not proceed to restore or cutover."
  exit 1
fi

echo "RESULT: all structural checks passed."
echo
echo "Still required before cutover, and NOT covered here:"
echo "  - sections 5-9 of verify_rls_policies.sql (two real users) -> task 19-05"
echo
echo "If the two 'grant present' checks failed, migration 012 did not run."
echo "Apply supabase/migrations/012_core_table_grants.sql and re-verify."
