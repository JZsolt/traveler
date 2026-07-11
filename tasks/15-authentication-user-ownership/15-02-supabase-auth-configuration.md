# 15-02 — Supabase Auth Configuration ✅ DONE

**Estimate:** 1-2 hours

## Goal

Configure Supabase email/password auth for local and production use.

## Scope

- Email/password auth
- Email verification
- Password reset redirect URLs
- Localhost and Vercel production callback URLs
- Required env/config documentation

## Acceptance Criteria

- Registration can create a Supabase auth user.
- Email verification flow is documented and testable.
- Login/logout works with the Supabase client.
- Password reset redirect returns to the app.
- Required Supabase dashboard settings are documented.

## Review Checklist

- [ ] No service role key is exposed to frontend code.
- [ ] Redirect URLs include local and production values.
- [ ] Email verification behavior is explicit.
- [ ] Google/social auth is not added in this task.
