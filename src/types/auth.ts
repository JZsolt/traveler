import type { z } from 'zod'
import type {
  LoginFormSchema,
  RegisterFormSchema,
  ForgotPasswordFormSchema,
  ResetPasswordFormSchema,
  AppUserSchema,
  ProfileSchema,
} from '@/schemas/auth'

export type LoginFormData = z.infer<typeof LoginFormSchema>
export type RegisterFormData = z.infer<typeof RegisterFormSchema>
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>
export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>
export type AppUser = z.infer<typeof AppUserSchema>
export type Profile = z.infer<typeof ProfileSchema>
