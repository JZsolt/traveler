import { z } from 'zod'
import { TripImportDataSchema } from './trip'

export const TripBackupEnvelopeSchema = z.object({
  application: z.literal('Traveler'),
  version: z.number(),
  schema: z.number(),
  exportedAt: z.string().datetime(),
  trip: z.object({
    id: z.string().optional(),
    slug: z.string().min(1),
    trip_data: TripImportDataSchema,
    owner: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  }),
})
