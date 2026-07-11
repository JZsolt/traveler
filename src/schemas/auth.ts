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
