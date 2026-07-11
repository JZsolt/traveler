import { z } from 'zod'

export const AdminLoginResponseSchema = z.object({
  ok: z.boolean(),
  error: z.object({
    message: z.string(),
  }).optional(),
})

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
})

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const RegisterFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1).max(100).optional(),
})

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
})

export const ResetPasswordFormSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'A jelszavak nem egyeznek.',
  path: ['confirmPassword'],
})

export const AppUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  emailVerified: z.boolean(),
})
