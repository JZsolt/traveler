import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ApiRequest, ApiResponse } from '../../src/types/http'
import { getErrorCode } from './adminAuthTypes'
import type { MockResData } from './adminAuthTypes'

// A _server-auth-ot mockoljuk: a hitelesitest a server-auth.test.ts fedi. Itt az
// owner-management logikat teszteljuk egy chainable Supabase mockkal.
vi.mock('../_server-auth.js', () => ({ requireAuthenticatedUser: vi.fn() }))

import { requireAuthenticatedUser } from '../_server-auth.js'
import handler from '../_trip-share-management-route.js'
import { encryptShareToken } from '../_share-crypto.js'

const TEST_KEY = Buffer.alloc(32, 5).toString('base64')
const OWNER = { id: 'owner-1' }
const ISO = '2026-07-30T10:00:00+00:00'
// A response ManagedShareSchema.id UUID-t var, ezert valodi UUID kell a share soroknak.
const SHARE_ID = '550e8400-e29b-41d4-a716-446655440099'

// A from() hivasok sorrendjeben "fogyasztott" eredmeny-sor. Minden lancmetodus
// ugyanazt a thenable buildert adja vissza, ami a sorhoz rendelt eredmenyre resolve-ol.
let queue: Array<{ data?: unknown; error?: unknown }>
let fromTables: string[]

function makeSupabase() {
  return {
    from(table: string) {
      fromTables.push(table)
      const result = queue.shift() ?? { data: null, error: null }
      const builder: Record<string, unknown> = {}
      const chain = () => builder
      for (const m of ['select', 'eq', 'is', 'or', 'lt', 'insert', 'update', 'single', 'maybeSingle']) {
        builder[m] = chain
      }
      builder.then = (resolve: (v: unknown) => void) => resolve(result)
      return builder
    },
  }
}

function mockReq(body: unknown): ApiRequest {
  return { method: 'POST', headers: {}, body } as unknown as ApiRequest
}

function mockRes(): ApiResponse & { _data: MockResData } {
  const data: MockResData = { statusCode: 0, body: null }
  const res = {
    _data: data,
    status(code: number) { data.statusCode = code; return this },
    json(body: unknown) { data.body = body; return this },
  }
  return res as unknown as ApiResponse & { _data: MockResData }
}

function bodyOf(res: ApiResponse & { _data: MockResData }): Record<string, unknown> {
  return (res._data.body ?? {}) as Record<string, unknown>
}
function shareOf(res: ApiResponse & { _data: MockResData }): Record<string, unknown> | null {
  const share = bodyOf(res).share
  return share ? (share as Record<string, unknown>) : null
}

let keyBackup: string | undefined

beforeEach(() => {
  queue = []
  fromTables = []
  keyBackup = process.env.SHARE_TOKEN_ENCRYPTION_KEY
  process.env.SHARE_TOKEN_ENCRYPTION_KEY = TEST_KEY
  vi.mocked(requireAuthenticatedUser).mockResolvedValue({
    supabase: makeSupabase() as never,
    user: OWNER as never,
  })
})

afterEach(() => {
  if (keyBackup === undefined) delete process.env.SHARE_TOKEN_ENCRYPTION_KEY
  else process.env.SHARE_TOKEN_ENCRYPTION_KEY = keyBackup
  vi.restoreAllMocks()
})

describe('trip-share-management endpoint', () => {
  it('returns 404 for a non-owner / unknown slug (trip not resolved)', async () => {
    queue = [{ data: null }] // resolveOwnedTripId -> no owned trip
    const res = mockRes()
    await handler(mockReq({ slug: 'nope', action: 'get' }), res)
    expect(res._data.statusCode).toBe(404)
    expect(getErrorCode(res._data.body)).toBe('TRIP_NOT_FOUND')
    expect(fromTables).toEqual(['trips'])
  })

  it('get returns null share when there is no active share', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: null }]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', action: 'get' }), res)
    expect(res._data.statusCode).toBe(200)
    expect(shareOf(res)).toBeNull()
  })

  it('get decrypts the token for a re-displayable share and never leaks DB internals', async () => {
    const enc = encryptShareToken('raw-share-token-1234567890-abcdef')
    queue = [
      { data: { id: 'trip-1' } },
      { data: { id: SHARE_ID, created_at: ISO, expires_at: null, token_ciphertext: enc.ciphertext, token_key_version: enc.keyVersion } },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', action: 'get' }), res)
    expect(res._data.statusCode).toBe(200)
    const share = shareOf(res)
    expect(share?.token).toBe('raw-share-token-1234567890-abcdef')
    expect('token_hash' in (share ?? {})).toBe(false)
    expect('token_ciphertext' in (share ?? {})).toBe(false)
  })

  it('get returns token:null for a legacy share without ciphertext', async () => {
    queue = [
      { data: { id: 'trip-1' } },
      { data: { id: SHARE_ID, created_at: ISO, expires_at: null, token_ciphertext: null, token_key_version: 1 } },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', action: 'get' }), res)
    expect(shareOf(res)?.token).toBeNull()
  })

  it('revoke reports revoked:false when nothing was active (stale)', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: null }] // resolve, revokeActiveShares -> 0 rows
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', action: 'revoke' }), res)
    expect(res._data.statusCode).toBe(200)
    expect(bodyOf(res).revoked).toBe(false)
    expect(shareOf(res)).toBeNull()
  })

  it('revoke reports revoked:true when an active share was revoked', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: { id: 'share-1' } }]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', action: 'revoke' }), res)
    expect(bodyOf(res).revoked).toBe(true)
  })

  it('create returns 409 when an active share already exists', async () => {
    queue = [
      { data: { id: 'trip-1' } }, // resolve
      { error: null }, // revokeExpiredShares
      { data: { id: 'share-existing', created_at: ISO, expires_at: null, token_ciphertext: 'x', token_key_version: 1 } }, // loadActiveShare
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', action: 'create' }), res)
    expect(res._data.statusCode).toBe(409)
    expect(getErrorCode(res._data.body)).toBe('ACTIVE_SHARE_EXISTS')
  })

  it('regenerate fails the encryption preflight WITHOUT revoking the old link', async () => {
    delete process.env.SHARE_TOKEN_ENCRYPTION_KEY // encryption will fail
    queue = [{ data: { id: 'trip-1' } }] // only resolveOwnedTripId should run
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', action: 'regenerate' }), res)
    expect(res._data.statusCode).toBe(500)
    expect(getErrorCode(res._data.body)).toBe('SHARE_ENCRYPTION_FAILED')
    // Only the trips resolve ran — no trip_shares mutation (old link intact).
    expect(fromTables).toEqual(['trips'])
  })
})
