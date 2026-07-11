# Supabase Auth Configuration Guide

## Supabase Dashboard Settings

### Authentication → Providers

1. Enable **Email** provider (enabled by default).
2. Disable all social/OAuth providers (Google login is not in scope).
3. Settings under Email provider:
   - **Confirm email**: ON (mandatory email verification).
   - **Secure email change**: ON.
   - **Double confirm email changes**: recommended ON.

### Authentication → URL Configuration

1. **Site URL**: `https://your-vercel-domain.vercel.app`
2. **Redirect URLs** (add all):
   - `http://localhost:5173` (local dev)
   - `http://localhost:5173/**` (local dev deep links)
   - `https://your-vercel-domain.vercel.app` (production)
   - `https://your-vercel-domain.vercel.app/**` (production deep links)

These redirect URLs are used for:
- Email verification callback
- Password reset callback
- OAuth callbacks (future)

### Authentication → Email Templates

Customise the email templates (optional but recommended):

- **Confirm signup**: change the confirmation link text to Hungarian.
- **Reset password**: change the reset link text to Hungarian.
- **Magic link**: not used (disable if possible).
- **Change email**: change the confirmation text to Hungarian.

The `{{ .ConfirmationURL }}` variable in templates automatically uses the
configured Site URL and Redirect URLs.

### Authentication → Rate Limits

Default Supabase rate limits are fine for initial launch:
- Email signups: 3 per hour per IP
- Password attempts: 30 per hour per IP
- Token refresh: 360 per hour per user

## Environment Variables

### Frontend (VITE_ prefix — public, RLS-protected)

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

These are safe to expose — the anon key only grants RLS-filtered access.

### Server (NO VITE_ prefix — never in frontend bundle)

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_USER_ID=uuid-of-admin-user
ADMIN_PASSWORD=your-admin-challenge-password
```

### Vercel Environment Variables

Set all of the above in Vercel → Settings → Environment Variables.
Ensure server-side variables do NOT have the `VITE_` prefix.

## Email Verification Flow

1. User calls `supabase.auth.signUp({ email, password })`.
2. Supabase creates the user in `auth.users` with `email_confirmed_at = null`.
3. Supabase sends a verification email with a confirmation link.
4. The confirmation link points to:
   `https://your-domain.vercel.app/auth/callback#access_token=...&type=signup`
5. The app handles the `/auth/callback` route, which calls
   `supabase.auth.exchangeCodeForSession()` or lets the JS client auto-handle
   the hash fragment.
6. After verification, `email_confirmed_at` is set and the user has an active
   session.

### Important: Supabase auto-confirm mode (local dev)

For local development, Supabase may have "Confirm email" disabled by default
in some project setups. To test the full verification flow locally:

1. Enable "Confirm email" in the dashboard even for development.
2. Use Supabase's Inbucket (local email testing) if running Supabase locally.
3. Or temporarily disable "Confirm email" for rapid local iteration, but
   always test the full flow before deploying.

## Password Reset Flow

1. User calls `supabase.auth.resetPasswordForEmail(email, { redirectTo })`.
2. `redirectTo` should be `${window.location.origin}/auth/callback`.
3. Supabase sends a reset email with a link that includes a recovery token.
4. The link redirects to the app's callback route.
5. The app detects the `type=recovery` event and shows a "set new password" form.
6. User calls `supabase.auth.updateUser({ password: newPassword })`.

## Auth Callback Route

The app needs an `/auth/callback` route (or similar) that:

1. Reads the URL hash fragment or query parameters.
2. Lets the Supabase JS client process the auth event.
3. Redirects to the appropriate page:
   - `type=signup` → `/app/trips` (after email verification)
   - `type=recovery` → show password reset form
   - `type=email_change` → show confirmation message

## Supabase Client Auth Configuration

The Supabase client in `src/lib/supabase.ts` works with auth out of the box.
The `createClient()` call with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
automatically handles:

- Session persistence in `localStorage`
- Automatic token refresh
- Auth state change events via `supabase.auth.onAuthStateChange()`

No additional client configuration is needed for basic email/password auth.
