import { ProfileShareIdSchema } from '@/schemas/profileShare'

export function extractProfileShareId(input: string): string | null {
  const trimmed = input.trim()
  if (ProfileShareIdSchema.safeParse(trimmed).success) return trimmed

  try {
    const url = new URL(trimmed)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts.length > 0 ? parts[parts.length - 1] : ''
    return ProfileShareIdSchema.safeParse(id).success ? id : null
  } catch {
    return null
  }
}
