import { describe, it, expect } from 'vitest'
import {
  AdminLoginResponseSchema,
  AppUserSchema,
  ProfileSchema,
  LoginFormSchema,
  RegisterFormSchema,
  ResetPasswordFormSchema,
} from '../auth'

describe('AdminLoginResponseSchema', () => {
  it('accepts success response', () => {
    expect(AdminLoginResponseSchema.safeParse({ ok: true }).success).toBe(true)
  })

  it('accepts error response with message', () => {
    const data = { ok: false, error: { message: 'Hibas jelszo.' } }
    expect(AdminLoginResponseSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing ok field', () => {
    expect(AdminLoginResponseSchema.safeParse({}).success).toBe(false)
  })

  it('rejects non-boolean ok', () => {
    expect(AdminLoginResponseSchema.safeParse({ ok: 'yes' }).success).toBe(false)
  })

  it('rejects error with non-string message', () => {
    const data = { ok: false, error: { message: 123 } }
    expect(AdminLoginResponseSchema.safeParse(data).success).toBe(false)
  })
})

describe('AppUserSchema', () => {
  const validUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    emailVerified: true,
  }

  it('accepts valid user', () => {
    expect(AppUserSchema.safeParse(validUser).success).toBe(true)
  })

  it('rejects invalid uuid', () => {
    expect(AppUserSchema.safeParse({ ...validUser, id: 'not-uuid' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(AppUserSchema.safeParse({ ...validUser, email: 'bad' }).success).toBe(false)
  })

  it('rejects missing emailVerified', () => {
    const { emailVerified: _, ...noVerified } = validUser
    expect(AppUserSchema.safeParse(noVerified).success).toBe(false)
  })

  it('rejects spoofed id type', () => {
    expect(AppUserSchema.safeParse({ ...validUser, id: 123 }).success).toBe(false)
  })
})

describe('ProfileSchema', () => {
  const validProfile = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    display_name: 'Test User',
    avatar_url: null,
    public_share_id: null,
    profile_share_enabled: false,
    profile_share_rotated_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  }

  it('accepts valid profile', () => {
    expect(ProfileSchema.safeParse(validProfile).success).toBe(true)
  })

  it('accepts null display_name', () => {
    expect(ProfileSchema.safeParse({ ...validProfile, display_name: null }).success).toBe(true)
  })

  it('defaults profile QR sharing fields for older profile rows', () => {
    const {
      public_share_id: _publicShareId,
      profile_share_enabled: _enabled,
      profile_share_rotated_at: _rotatedAt,
      ...legacyProfile
    } = validProfile
    const result = ProfileSchema.safeParse(legacyProfile)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.public_share_id).toBe(null)
      expect(result.data.profile_share_enabled).toBe(false)
      expect(result.data.profile_share_rotated_at).toBe(null)
    }
  })

  it('rejects invalid datetime', () => {
    expect(ProfileSchema.safeParse({ ...validProfile, created_at: 'bad' }).success).toBe(false)
  })

  it('rejects non-uuid id', () => {
    expect(ProfileSchema.safeParse({ ...validProfile, id: 'x' }).success).toBe(false)
  })
})

describe('LoginFormSchema', () => {
  it('accepts valid credentials', () => {
    expect(LoginFormSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true)
  })

  it('rejects short password', () => {
    expect(LoginFormSchema.safeParse({ email: 'a@b.com', password: '12345' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(LoginFormSchema.safeParse({ email: 'bad', password: '123456' }).success).toBe(false)
  })
})

describe('RegisterFormSchema', () => {
  it('accepts registration with display name', () => {
    const data = { email: 'a@b.com', password: '123456', displayName: 'Test' }
    expect(RegisterFormSchema.safeParse(data).success).toBe(true)
  })

  it('accepts registration without display name', () => {
    expect(RegisterFormSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true)
  })

  it('rejects display name over 100 chars', () => {
    const data = { email: 'a@b.com', password: '123456', displayName: 'x'.repeat(101) }
    expect(RegisterFormSchema.safeParse(data).success).toBe(false)
  })

  it('accepts empty string displayName (handler converts to undefined)', () => {
    const data = { email: 'a@b.com', password: '123456', displayName: '' }
    expect(RegisterFormSchema.safeParse(data).success).toBe(true)
  })

  it('accepts whitespace-only displayName (handler converts to undefined)', () => {
    const data = { email: 'a@b.com', password: '123456', displayName: '   ' }
    expect(RegisterFormSchema.safeParse(data).success).toBe(true)
  })
})

describe('ResetPasswordFormSchema', () => {
  it('accepts matching passwords', () => {
    const data = { password: '123456', confirmPassword: '123456' }
    expect(ResetPasswordFormSchema.safeParse(data).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const data = { password: '123456', confirmPassword: '654321' }
    expect(ResetPasswordFormSchema.safeParse(data).success).toBe(false)
  })
})
