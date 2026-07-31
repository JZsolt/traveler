import { describe, expect, it } from 'vitest'
import {
  ProfileShareIdSchema,
  ProfileShareManagementRequestSchema,
  ProfileShareManagementResponseSchema,
} from '../profileShare'
import { RecipientRequestSchema } from '../recipients'

const PROFILE_SHARE_ID = 'abcdefghijklmnopqrstuvwxyzABCDEF'

describe('ProfileShareIdSchema', () => {
  it('accepts non-guessable URL-safe ids', () => {
    expect(ProfileShareIdSchema.safeParse(PROFILE_SHARE_ID).success).toBe(true)
    expect(ProfileShareIdSchema.safeParse('abc_DEF-1234567890abc_DEF-123456').success).toBe(true)
  })

  it('rejects short or non URL-safe ids', () => {
    expect(ProfileShareIdSchema.safeParse('short').success).toBe(false)
    expect(ProfileShareIdSchema.safeParse('x'.repeat(32) + '.').success).toBe(false)
  })
})

describe('ProfileShareManagementSchema', () => {
  it('accepts supported actions and response state', () => {
    expect(ProfileShareManagementRequestSchema.safeParse({ action: 'enable' }).success).toBe(true)
    expect(ProfileShareManagementResponseSchema.safeParse({
      ok: true,
      profileShare: {
        enabled: true,
        publicShareId: PROFILE_SHARE_ID,
        rotatedAt: '2026-07-30T10:00:00+00:00',
      },
    }).success).toBe(true)
  })

  it('rejects unsupported actions', () => {
    expect(ProfileShareManagementRequestSchema.safeParse({ action: 'delete' }).success).toBe(false)
  })
})

describe('RecipientRequestSchema profile QR invite', () => {
  it('accepts invite by publicShareId', () => {
    expect(RecipientRequestSchema.safeParse({
      action: 'invite',
      slug: 'roma',
      publicShareId: PROFILE_SHARE_ID,
    }).success).toBe(true)
  })

  it('rejects malformed publicShareId', () => {
    expect(RecipientRequestSchema.safeParse({
      action: 'invite',
      slug: 'roma',
      publicShareId: 'short',
    }).success).toBe(false)
  })
})
