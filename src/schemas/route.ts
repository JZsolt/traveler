import { z } from 'zod'

export const SlugSchema = z.string().min(1).max(200).regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/)

export function parseSlug(raw: string | undefined): string | undefined {
  const result = SlugSchema.safeParse(raw)
  return result.success ? result.data : undefined
}
