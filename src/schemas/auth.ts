import { z } from 'zod'

export const AdminLoginResponseSchema = z.object({
  ok: z.boolean(),
  error: z.object({
    message: z.string(),
  }).optional(),
})
