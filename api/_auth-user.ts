import { SupabaseAuthUserResponseSchema } from '../src/schemas/auth.js'
import type { ServerAuthUser } from '../src/types/auth'

export async function fetchAuthenticatedUser(
  supabaseUrl: string,
  supabaseKey: string,
  token: string,
): Promise<ServerAuthUser | null> {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) return null

  const raw: unknown = await response.json().catch(() => null)
  const parsed = SupabaseAuthUserResponseSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}
