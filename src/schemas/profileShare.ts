import { z } from 'zod'

export const ProfileShareIdSchema = z.string().min(32).max(80).regex(/^[A-Za-z0-9_-]+$/)

export const ProfileShareManagementRequestSchema = z.object({
  action: z.enum(['get', 'enable', 'rotate', 'disable']),
})

export const ProfileShareStateSchema = z.object({
  enabled: z.boolean(),
  publicShareId: ProfileShareIdSchema.nullable(),
  rotatedAt: z.string().datetime({ offset: true }).nullable(),
})

export const ProfileShareManagementResponseSchema = z.object({
  ok: z.literal(true),
  profileShare: ProfileShareStateSchema,
})
