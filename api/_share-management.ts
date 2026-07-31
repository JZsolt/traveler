import type { AuthenticatedServerContext } from '../src/types/apiServer'
import type {
  CreateShareOutcome,
  BuildShareTokenOutcome,
  PreparedShareToken,
  ActiveShareRow,
} from '../src/types/shareServer'
import { createRawShareToken, hashShareToken } from './_share-token.js'
import { encryptShareToken } from './_share-crypto.js'

// Owner-scoped feloldas: a slughoz tartozo trip id-t adja, ha a hivo a tulajdonos
// (RLS + explicit owner_id szuro). Query hibat tovabb dob.
export async function resolveOwnedTripId(
  ctx: AuthenticatedServerContext,
  slug: string,
): Promise<string | null> {
  const { data, error } = await ctx.supabase
    .from('trips')
    .select('id')
    .eq('slug', slug)
    .eq('owner_id', ctx.user.id)
    .maybeSingle()
  if (error) throw error
  return data && typeof data.id === 'string' ? data.id : null
}

// A trip egyetlen AKTIV (nem visszavont ES nem lejart) share sora (ciphertexttel),
// vagy null. Lejart sort NEM ad vissza, hogy a "get" ne mutasson olyan linket,
// amit a public lookup mar lejartkent elutasitana. A unique index miatt legfeljebb
// egy nem-visszavont sor letezik.
export async function loadActiveShare(
  ctx: AuthenticatedServerContext,
  tripId: string,
): Promise<ActiveShareRow | null> {
  const nowIso = new Date().toISOString()
  const { data, error } = await ctx.supabase
    .from('trip_shares')
    .select('id, created_at, expires_at, token_ciphertext, token_key_version')
    .eq('trip_id', tripId)
    .is('revoked_at', null)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .maybeSingle()
  if (error) throw error
  return data ?? null
}

// A lejart, de meg nem visszavont share-eket visszavonja (hogy ne foglaljak a
// unique index slotot). Uj link letrehozasa elott hivando.
export async function revokeExpiredShares(
  ctx: AuthenticatedServerContext,
  tripId: string,
): Promise<void> {
  const nowIso = new Date().toISOString()
  const { error } = await ctx.supabase
    .from('trip_shares')
    .update({ revoked_at: nowIso })
    .eq('trip_id', tripId)
    .is('revoked_at', null)
    .lt('expires_at', nowIso)
  if (error) throw error
}

// Minden aktiv (nem visszavont) share visszavonasa. Visszaadja, hogy tenylegesen
// erintett-e sort (stale UI eldontesehez).
export async function revokeActiveShares(
  ctx: AuthenticatedServerContext,
  tripId: string,
): Promise<boolean> {
  const { data, error } = await ctx.supabase
    .from('trip_shares')
    .update({ revoked_at: new Date().toISOString() })
    .eq('trip_id', tripId)
    .is('revoked_at', null)
    .select('id')
    .maybeSingle()
  if (error) throw error
  return !!data
}

// Titkositasi PREFLIGHT: nyers token generalas + hash + titkositas, DB irodas
// nelkul. A regenerate ezt hivja a regi link visszavonasa ELOTT, igy titkositasi/
// env hibanal a mukodo regi link nem vesz el. Nyers tokent SOHA nem logol.
export function buildShareToken(): BuildShareTokenOutcome {
  const rawToken = createRawShareToken()
  const tokenHash = hashShareToken(rawToken)
  try {
    const { ciphertext, keyVersion } = encryptShareToken(rawToken)
    return { ok: true, prepared: { rawToken, tokenHash, ciphertext, keyVersion } }
  } catch (encryptError) {
    console.error('[trip-share-management] token encryption failed', {
      message: encryptError instanceof Error ? encryptError.message : 'unknown',
    })
    return { ok: false, status: 500, code: 'SHARE_ENCRYPTION_FAILED', message: 'Nem sikerult letrehozni a megosztasi linket (titkositasi hiba).' }
  }
}

// Az elokeszitett token beszurasa a DB-be. A nyers tokent visszaadja a hivonak
// (owner), de SOHA nem logolja.
export async function insertShareRow(
  ctx: AuthenticatedServerContext,
  tripId: string,
  prepared: PreparedShareToken,
  expiresAtValue: string | null,
): Promise<CreateShareOutcome> {
  const { data, error } = await ctx.supabase
    .from('trip_shares')
    .insert({
      trip_id: tripId,
      token_hash: prepared.tokenHash,
      token_ciphertext: prepared.ciphertext,
      token_key_version: prepared.keyVersion,
      created_by: ctx.user.id,
      expires_at: expiresAtValue,
    })
    .select('id, created_at, expires_at')
    .single()

  if (error || !data) {
    if (error?.code === '23505') {
      return { ok: false, status: 409, code: 'ACTIVE_SHARE_EXISTS', message: 'Ehhez az utazashoz mar van aktiv megosztasi link.' }
    }
    if (error?.code === '23514') {
      return { ok: false, status: 400, code: 'INVALID_EXPIRY', message: 'A lejarati ido csak jovobeli idopont lehet.' }
    }
    console.error('[trip-share-management] insert failed', { code: error?.code })
    return { ok: false, status: 500, code: 'SHARE_CREATE_FAILED', message: 'Nem sikerult letrehozni a megosztasi linket.' }
  }

  return { ok: true, id: data.id, createdAt: data.created_at, expiresAt: data.expires_at, token: prepared.rawToken }
}
