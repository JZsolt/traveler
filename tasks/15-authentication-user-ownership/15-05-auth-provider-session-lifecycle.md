# 15-05 — AuthProvider And Session Lifecycle ✅ DONE

**Estimate:** 2-3 hours

## Goal

Introduce central authenticated session state.

## Scope

- `AuthProvider`
- `useAuth`
- `user`, `profile`, `session`, `isLoading`
- `signIn`, `signUp`, `signOut`, `resetPassword`
- Supabase auth subscription
- Session restore on refresh

## Acceptance Criteria

- Refresh restores an existing session.
- Loading state prevents route flicker.
- Logout clears auth state. Trip cache clearing deferred to 15-10 (TripsContext user scoping).
- Auth subscription unsubscribes on cleanup.
- AuthProvider does not own trip business logic.

## Review Checklist

- [ ] No auth state is trusted as a server security boundary.
- [ ] No service role key is used in frontend.
- [ ] Browser storage data is schema-validated if used.
- [ ] Provider file stays under the project file-size limit.
