import { randomBytes } from 'node:crypto'
import type { AuthenticatedServerContext } from '../src/types/apiServer'
import type { ProfileShareState } from '../src/types/profileShare'
import type { ProfileShareRowFields, ProfileShareUpdatePatch } from '../src/types/profileShareServer'

const PROFILE_SHARE_ID_BYTES = 24
const MAX_GENERATION_ATTEMPTS = 3

function generateProfileShareId(): string {
  return randomBytes(PROFILE_SHARE_ID_BYTES).toString('base64url')
}

function hasUniqueViolationCode(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === '23505'
}

function toProfileShareState(row: ProfileShareRowFields): ProfileShareState {
  return {
    enabled: row.profile_share_enabled === true,
    publicShareId: row.public_share_id,
    rotatedAt: row.profile_share_rotated_at,
  }
}

async function getProfileRow(ctx: AuthenticatedServerContext, userId: string) {
  const { data, error } = await ctx.supabase
    .from('profiles')
    .select('public_share_id, profile_share_enabled, profile_share_rotated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (data) return data

  const { data: inserted, error: insertError } = await ctx.supabase
    .from('profiles')
    .insert({ id: userId })
    .select('public_share_id, profile_share_enabled, profile_share_rotated_at')
    .maybeSingle()
  if (insertError) throw insertError
  if (!inserted) throw new Error('PROFILE_CREATE_FAILED')
  return inserted
}

async function updateProfileShare(
  ctx: AuthenticatedServerContext,
  userId: string,
  patch: ProfileShareUpdatePatch,
): Promise<ProfileShareState> {
  const { data, error } = await ctx.supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('public_share_id, profile_share_enabled, profile_share_rotated_at')
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('PROFILE_UPDATE_FAILED')
  return toProfileShareState(data)
}

export async function getProfileShare(ctx: AuthenticatedServerContext, userId: string): Promise<ProfileShareState> {
  return toProfileShareState(await getProfileRow(ctx, userId))
}

export async function enableProfileShare(ctx: AuthenticatedServerContext, userId: string): Promise<ProfileShareState> {
  const current = await getProfileRow(ctx, userId)
  if (current.public_share_id) {
    return updateProfileShare(ctx, userId, { profile_share_enabled: true })
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    try {
      return await updateProfileShare(ctx, userId, {
        public_share_id: generateProfileShareId(),
        profile_share_enabled: true,
        profile_share_rotated_at: new Date().toISOString(),
      })
    } catch (err) {
      if (!hasUniqueViolationCode(err)) throw err
    }
  }
  throw new Error('PROFILE_SHARE_ID_COLLISION')
}

export async function rotateProfileShare(ctx: AuthenticatedServerContext, userId: string): Promise<ProfileShareState> {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    try {
      return await updateProfileShare(ctx, userId, {
        public_share_id: generateProfileShareId(),
        profile_share_enabled: true,
        profile_share_rotated_at: new Date().toISOString(),
      })
    } catch (err) {
      if (!hasUniqueViolationCode(err)) throw err
    }
  }
  throw new Error('PROFILE_SHARE_ID_COLLISION')
}

export async function disableProfileShare(ctx: AuthenticatedServerContext, userId: string): Promise<ProfileShareState> {
  await getProfileRow(ctx, userId)
  return updateProfileShare(ctx, userId, { profile_share_enabled: false })
}
