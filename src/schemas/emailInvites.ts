import { z } from 'zod'

export const SendTripInviteEmailRequestSchema = z.object({
  slug: z.string().min(1),
  recipientEmail: z.string().email().max(320),
})

export const SendTripInviteEmailResponseSchema = z.object({
  ok: z.literal(true),
  status: z.enum(['sent', 'duplicate']),
})
