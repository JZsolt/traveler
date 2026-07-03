# 09-01 — Admin Password Check Endpoint ✅ DONE

Read only:

- `api/`
- `package.json`

Goal: create a small server endpoint that validates the admin password from env.

Requirements:

1. Create `/api/admin-login.js`.
2. Only allow `POST`.
3. Read `ADMIN_PASSWORD` from server env.
4. Accept request body:

```json
{
  "password": "user input"
}
```

5. Return this for a valid password:

```json
{
  "ok": true
}
```

6. For missing/invalid password, return:

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_ADMIN_PASSWORD",
    "message": "Hibás admin jelszó."
  }
}
```

7. For missing env, return a readable config error.
8. Never return the expected password.
9. Never log the submitted password.
10. Keep response shapes UI-safe and Hungarian.

Manual test flow to report:

- POST correct password and confirm `ok: true`.
- POST wrong password and confirm readable error.
- Temporarily remove `ADMIN_PASSWORD` and confirm readable config error.

Do not write automated tests.
Run `pnpm run build`.
