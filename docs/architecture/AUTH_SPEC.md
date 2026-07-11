# Auth, Ownership And Access Control Specification

## Purpose

Canonical product and security specification for authentication, trip ownership,
admin access, and route protection. Written before any implementation begins.

## Roles

### Normal User (authenticated)

- Has a Supabase auth account (email + password).
- Can create, read, edit, delete, export, and AI-improve their own trips.
- Cannot see, edit, or delete trips owned by other users.
- Does not have admin/backup access.

### Public Visitor (unauthenticated)

- Can view the landing page and public marketing routes.
- Can view shared trips via dedicated share tokens (Phase 16).
- Cannot access `/app/*` routes.
- Cannot call trip mutation endpoints.

### Admin

- A normal authenticated user whose Supabase user id matches the server-side
  `ADMIN_USER_ID` env variable (single UUID).
- Must pass an additional admin challenge dialog (server-checked admin password,
  `ADMIN_PASSWORD` env) to activate a short-lived admin session.
- Can access the hidden admin area (`/app/internal/backup`).
- Can trigger backup export and bulk import.
- Does NOT automatically get "edit any trip" capability through the normal UI.
- Admin privilege is verified server-side on every admin endpoint call:
  Supabase JWT UID must match `ADMIN_USER_ID` AND the admin session must be
  active.

## Permissions Matrix

| Action                      | Public | Normal User     | Admin              |
| --------------------------- | ------ | --------------- | ------------------ |
| View landing / public pages | yes    | yes             | yes                |
| View shared trip (Phase 16) | yes    | yes             | yes                |
| Login / register / recover  | yes    | n/a (logged in) | n/a (logged in)    |
| View own trips dashboard    | no     | yes             | yes                |
| Create trip                 | no     | yes             | yes                |
| Read own trip               | no     | yes             | yes                |
| Edit own trip               | no     | yes             | yes                |
| Delete own trip             | no     | yes             | yes                |
| AI suggest / expand / chat  | no     | yes             | yes                |
| Export own trip JSON         | no     | yes             | yes                |
| Read other user's trip      | no     | no              | no (via normal UI) |
| Edit other user's trip      | no     | no              | no                 |
| Backup all trips to GitHub  | no     | no              | yes                |
| Bulk import from backup     | no     | no              | yes                |
| Admin area access           | no     | no              | yes                |

## Route Inventory

### Current Routes (pre-auth)

| Path               | Purpose            | Auth required |
| ------------------ | ------------------ | ------------- |
| `/`                | Home (all trips)   | no            |
| `/trip/:slug`      | Trip detail        | no            |
| `/trip/:slug/edit` | Trip edit          | no            |
| `/create-trip`     | Create new trip    | no            |
| `/settings`        | Settings           | no            |
| `/design-system`   | Design system (dev)| no            |

### Target Routes (post-auth)

| Path                        | Purpose              | Auth required | Role        |
| --------------------------- | -------------------- | ------------- | ----------- |
| `/`                         | Public landing page  | no            | any         |
| `/login`                    | Login                | no            | public      |
| `/register`                 | Registration         | no            | public      |
| `/forgot-password`          | Password recovery    | no            | public      |
| `/app/trips`                | My trips dashboard   | yes           | user        |
| `/app/trips/new`            | Create new trip      | yes           | user        |
| `/app/trips/:tripId`        | Trip detail          | yes           | owner       |
| `/app/trips/:tripId/edit`   | Trip edit            | yes           | owner       |
| `/app/settings`             | User settings        | yes           | user        |
| `/app/internal/backup`      | Admin backup area    | yes           | admin       |
| `/share/:token` (Phase 16)  | Shared trip view     | no            | any         |

### Route Migration Strategy

1. Add new `/app/*` routes alongside existing routes.
2. Add auth guard wrapper that redirects unauthenticated users to `/login`.
3. After all app routes work under `/app/*`, redirect old paths:
   - `/` stays as public landing.
   - `/trip/:slug` redirects to `/app/trips/:tripId` if authenticated,
     or shows 404 if not and no share token.
   - `/create-trip` redirects to `/app/trips/new`.
   - `/settings` redirects to `/app/settings`.
4. Remove legacy route handlers once redirects are stable.

## Trip Identification: slug vs id

### Decision: use UUID `id` for app routes, keep `slug` for display

- App routes use `/app/trips/:tripId` where `tripId` is the UUID primary key.
- The `slug` column remains for URL-friendly display and export filenames.
- RLS policies filter by `owner_id` (UUID), not by `slug`.
- This prevents slug collisions between users and eliminates slug-guessing
  as an attack vector.

## Database Changes

### Current Schema (001_create_trips.sql)

```sql
trips (
  id uuid primary key,
  slug text unique not null,
  trip_data jsonb not null,
  owner text,           -- plain text, unused
  created_at timestamptz,
  updated_at timestamptz
)
```

### Target Schema

```sql
trips (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  trip_data jsonb not null,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

Key changes:
- `owner text` becomes `owner_id uuid not null references auth.users(id)`.
- `slug` loses `unique` constraint (different users may pick the same slug).
- Add unique constraint on `(owner_id, slug)` instead.
- Add index on `owner_id` for filtered queries.

### Existing Trip Owner Assignment

All existing trips were created before auth. Migration strategy:

1. Create the first authenticated admin user.
2. Run a one-time migration that sets `owner_id` to the admin user's UUID for
   all existing trips where `owner_id` is null.
3. After migration, `owner_id` becomes `NOT NULL`.
4. The old `owner text` column is dropped.

### Profiles Table

```sql
profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

Auto-populated via a trigger on `auth.users` insert.
`updated_at` is maintained by the same `handle_updated_at()` trigger function
used on the `trips` table.

## RLS Policy Changes

### Current Policies (BLOCKERS)

- `SELECT using (true)` — all trips publicly readable. This MUST be replaced
  before private user trips exist.
- `INSERT with check (true)` — anyone can insert. Must restrict to authenticated
  owner.
- `UPDATE/DELETE` — check `owner` text field, which is never actually set.

### Target Policies

```sql
-- Users can only read their own trips
create policy "Users read own trips"
  on public.trips for select
  using (auth.uid() = owner_id);

-- Users can insert trips they own
create policy "Users insert own trips"
  on public.trips for insert
  with check (auth.uid() = owner_id);

-- Users can update their own trips (with check prevents owner_id reassignment)
create policy "Users update own trips"
  on public.trips for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Users can delete their own trips
create policy "Users delete own trips"
  on public.trips for delete
  using (auth.uid() = owner_id);

-- Service role bypasses RLS (used by admin backup endpoints)
```

Admin backup endpoints use the `service_role` key, which bypasses RLS.
This is already the case for the current backup implementation.

## Admin Threat Model

### Principle: hidden UI is not security

The admin area at `/app/internal/backup` is hidden from navigation but its
existence is not a secret. Security comes from:

1. **Server-side UID check** — every admin endpoint verifies that the
   requesting user's Supabase auth UID matches the `ADMIN_USER_ID` env.
2. **Admin challenge** — even after UID match, the user must enter the
   `ADMIN_PASSWORD` via a challenge dialog. The server validates the password
   and issues a short-lived admin session token.
3. **Service role key** — admin backup operations use the Supabase service
   role key, which lives server-side only.
4. **RLS** — even if someone discovers the admin route, RLS prevents data
   access without proper credentials.

### Current admin system evolution

The current `ADMIN_PASSWORD` + `sessionStorage` system evolves to:

1. User logs in with Supabase auth (email + password) — normal auth.
2. Hidden gesture on profile footer/version area reveals admin entry
   (only when UID matches `ADMIN_USER_ID`).
3. Admin challenge dialog prompts for the admin password.
4. Server verifies both UID and password, returns a short-lived admin
   session/token.
5. Admin session expires automatically or can be manually cleared.
6. `sessionStorage` admin flag is replaced by the short-lived token.

### What admin can do

- Export all trips to GitHub backup (service_role bypass).
- Import trips from backup files (service_role bypass).
- View admin dashboard with system stats.

### What admin cannot do through the admin path

- Edit another user's trip through the normal edit UI.
- Delete another user's trip through the normal UI.
- Access another user's trip detail page.

If a superadmin "edit any trip" capability is ever needed, it must be a
separate, explicitly designed feature with audit logging.

## Authentication Flow

### Registration

1. User submits email + password on `/register`.
2. Supabase `auth.signUp()` creates the auth user and sends a verification
   email. A database trigger on `auth.users` insert idempotently creates a
   `profiles` row at this point (before verification).
3. User sees a "check your email" confirmation screen.
4. User clicks the verification link in the email.
5. Supabase verifies the email and creates an active session.
6. User is redirected to `/app/trips`.

Note: Supabase email verification must be configured as mandatory. Users
cannot access `/app/*` routes until their email is verified. The profile
bootstrap trigger fires on signup (not verification), so the profile row
exists even if the user never verifies. This is safe because unverified
users cannot obtain a session to access any data.

### Login

1. User submits email + password on `/login`.
2. Supabase `auth.signInWithPassword()` returns a session.
3. Session is stored by Supabase client (localStorage).
4. User is redirected to `/app/trips` (or the originally requested page).

### Password Recovery

1. User submits email on `/forgot-password`.
2. Supabase `auth.resetPasswordForEmail()` sends a reset email.
3. User clicks the link, sets a new password.

### Session Lifecycle

- Supabase JS client handles token refresh automatically.
- `AuthProvider` wraps the app, exposes `user`, `loading`, `signOut`.
- On signOut, clear session and redirect to `/`.

## API Endpoint Auth Changes

| Endpoint                  | Current auth       | Target auth                     |
| ------------------------- | ------------------ | ------------------------------- |
| `suggest-trip-section`    | admin password     | Supabase JWT (any authed user)  |
| `expand-day`              | admin password     | Supabase JWT (any authed user)  |
| `chat`                    | admin password     | Supabase JWT (any authed user)  |
| `plan-trip`               | admin password     | Supabase JWT (any authed user)  |
| `backup-trips`            | admin password     | Supabase JWT + UID + admin session |
| `import-trip-backup`      | admin password     | Supabase JWT + UID + admin session |
| `import-trip-backups`     | admin password     | Supabase JWT + UID + admin session |
| `admin-login`             | admin password     | Supabase JWT + UID + admin password challenge |

## Phase 16 Sharing Assumptions

- Shared trips use a separate `trip_shares` table with a unique token.
- Public visitors access shared trips via `/share/:token`.
- The share endpoint fetches the trip using `service_role` (bypasses RLS),
  then returns a read-only projection.
- The `trips` table never gets a public SELECT policy again.
- Share tokens can be revoked by the trip owner.

## Security Invariants

1. No trip data is accessible without authentication OR a valid share token.
2. RLS is the primary security boundary, not frontend route guards.
3. Frontend route guards are UX convenience only.
4. Admin endpoints verify UID + admin session server-side on every request.
5. `service_role` key never appears in frontend code.
6. JWT tokens are validated by Supabase, not by custom code.
7. `ADMIN_PASSWORD` remains as a server-side challenge secret; it is never
   exposed to frontend code or stored in browser storage.
