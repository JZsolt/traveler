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

const PROFILE_FALLBACK_ERROR = 'A profil betoltese sikertelen. Kerlek probald ujra.'
const PROFILE_PERMISSION_ERROR = 'Nincs jogosultsag a profil eleresehez.'
const PROFILE_SCHEMA_ERROR = 'A profil adatbazis sema hianyos. Kerlek ertesitsd az adminisztratort.'

function getErrorCode(err: unknown): string | null {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: unknown }).code
    return typeof code === 'string' ? code : null
  }
  return null
}

// A profil hibakat kategoriaba soroljuk, hogy nyers (angol) PostgREST/Supabase
// uzenet soha ne kerulhessen kozvetlenul user-facing state-be. A sajat dobott
// Error-ok mar biztonsagos magyar szoveget hordoznak, azok atmennek.
export function mapProfileError(err: unknown): string {
  if (err instanceof Error) return err.message

  const code = getErrorCode(err)
  if (code === '42501' || code === 'PGRST301' || code === 'PGRST116') {
    return PROFILE_PERMISSION_ERROR
  }
  if (code === '42P01' || code === '42703' || code === 'PGRST205') {
    return PROFILE_SCHEMA_ERROR
  }
  return PROFILE_FALLBACK_ERROR
}

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
