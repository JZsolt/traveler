# 15-06B — Auth Forms With React Hook Form ✅

**Status:** DONE
**Estimate:** 2-3 hours

## Goal

Migrate auth forms to React Hook Form while keeping Zod as the validation source
of truth.

## Scope

- `src/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/pages/ForgotPasswordPage.tsx`
- `src/components/auth/AuthFormField.tsx`
- Auth form-related types/helpers under `src/types/` and `src/lib/`

## Acceptance Criteria

- Login, register, and forgot-password forms use `react-hook-form`.
- Validation uses `@hookform/resolvers/zod` with existing schemas from
  `src/schemas/auth.ts`.
- No inline `Record<string, string>` or inline event types remain in page files.
- Field errors remain accessible through `aria-invalid` and `aria-describedby`.
- Loading/disabled states still prevent duplicate submits.
- Existing success/error UI behavior is preserved.

Required checks:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Review Checklist

- [ ] Zod schemas remain the single validation source.
- [ ] No duplicated form data type is created outside `src/types/auth.ts`.
- [ ] Password manager autocomplete values are preserved.
- [ ] No product route behavior changes are included.
- [ ] Reset-password callback UI is either implemented in its own task or
  explicitly documented as deferred.
