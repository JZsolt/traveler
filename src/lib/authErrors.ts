import type { AuthUser } from '@supabase/supabase-js'
import { AppUserSchema } from '@/schemas/auth'
import type { AppUser } from '@/types/auth'

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Hibas email vagy jelszo.',
  'Email not confirmed': 'Az email cim meg nincs megerositeve. Kerlek ellenorizd a postaladad.',
  'User already registered': 'Ezzel az email cimmel mar van regisztracio.',
  'Password should be at least 6 characters': 'A jelszonak legalabb 6 karakter hosszunak kell lennie.',
  'Email rate limit exceeded': 'Tul sok probalkozas. Kerlek varj egy kicsit.',
  'For security purposes, you can only request this after': 'Biztonsagi okokbol varj meg egy kicsit az ujabb probalkoassal.',
  'User not found': 'Nem talalhato felhasznalo ezzel az email cimmel.',
  'New password should be different from the old password': 'Az uj jelszo nem egyezhet a regivel.',
}

const FALLBACK_ERROR = 'Varatlan hiba tortent. Kerlek probald ujra.'

export function mapAuthError(err: unknown): string {
  const message = err instanceof Error
    ? err.message
    : typeof err === 'string'
      ? err
      : ''

  if (!message) return FALLBACK_ERROR

  for (const [pattern, hungarian] of Object.entries(ERROR_MAP)) {
    if (message.includes(pattern)) return hungarian
  }
  return FALLBACK_ERROR
}

export function toAppUser(user: AuthUser): AppUser | null {
  const candidate = {
    id: user.id,
    email: user.email ?? '',
    emailVerified: user.email_confirmed_at != null,
  }
  const result = AppUserSchema.safeParse(candidate)
  return result.success ? result.data : null
}
