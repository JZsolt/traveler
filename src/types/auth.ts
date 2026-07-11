import type { ReactNode } from 'react'
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

export interface AuthResult {
  ok: boolean
  error?: string
}

export interface AuthContextValue {
  user: AppUser | null
  profile: Profile | null
  profileError: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult>
  refreshProfile: () => Promise<void>
}

export interface AuthProviderProps {
  children: ReactNode
}
