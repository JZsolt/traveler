import type { z } from 'zod'
import type { RecipientRequestSchema, RecipientResponseSchema } from '@/schemas/recipients'

export type RecipientRequest = z.infer<typeof RecipientRequestSchema>
export type RecipientResponse = z.infer<typeof RecipientResponseSchema>
export type RecipientActionStatus = RecipientResponse['status']
