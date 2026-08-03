import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ApiRequest, ApiResponse } from '../../src/types/http'
import { getErrorCode } from './adminAuthTypes'
import type { MockResData } from './adminAuthTypes'

vi.mock('../_server-auth.js', () => ({ requireAuthenticatedUser: vi.fn() }))

import { requireAuthenticatedUser } from '../_server-auth.js'
import handler from '../_trip-recipients-route.js'

const OWNER = { id: 'owner-1' }
const INVITE_ID = '550e8400-e29b-41d4-a716-446655440042'
const PROFILE_SHARE_ID = 'abcdefghijklmnopqrstuvwxyzABCDEF'

// Sorrendben fogyasztott eredmenyek from() ES rpc() hivasokhoz.
let queue: Array<{ data?: unknown; error?: unknown; count?: number }>
let fromTables: string[]
let rpcCalls: string[]

function nextResult() {
  return queue.shift() ?? { data: null, error: null }
}

function makeSupabase() {
  return {
    from(table: string) {
      fromTables.push(table)
      const result = nextResult()
      const builder: Record<string, unknown> = {}
      const chain = () => builder
      for (const m of ['select', 'eq', 'is', 'or', 'lt', 'insert', 'update', 'single', 'maybeSingle']) {
        builder[m] = chain
      }
      builder.then = (resolve: (v: unknown) => void) => resolve(result)
      return builder
    },
    rpc(name: string) {
      rpcCalls.push(name)
      const result = nextResult()
      return { then: (resolve: (v: unknown) => void) => resolve(result) }
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

function statusOf(res: ApiResponse & { _data: MockResData }): unknown {
  return (res._data.body as Record<string, unknown> | null)?.status
}

beforeEach(() => {
  queue = []
  fromTables = []
  rpcCalls = []
  vi.mocked(requireAuthenticatedUser).mockResolvedValue({
    supabase: makeSupabase() as never,
    user: OWNER as never,
  })
})

afterEach(() => vi.restoreAllMocks())

describe('trip-recipients endpoint', () => {
  it('invite by a non-owner / unknown slug -> 404', async () => {
    queue = [{ data: null }] // resolveOwnedTripId -> none
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'nope', recipientEmail: 'a@b.com' }), res)
    expect(res._data.statusCode).toBe(404)
    expect(getErrorCode(res._data.body)).toBe('TRIP_NOT_FOUND')
  })

  it('invite to a non-existing app user -> not_app_user (public-link path)', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: null }] // trip resolve, rpc -> null
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', recipientEmail: 'ghost@b.com' }), res)
    expect(res._data.statusCode).toBe(200)
    expect(statusOf(res)).toBe('not_app_user')
    expect(rpcCalls).toContain('resolve_user_id_by_email')
  })

  it('invite yourself -> self', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: OWNER.id }] // rpc resolves to the owner
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', recipientEmail: 'me@b.com' }), res)
    expect(statusOf(res)).toBe('self')
  })

  it('invite an existing user -> invited (pending row)', async () => {
    // resolve, rpc, pending-count (0), insert
    queue = [{ data: { id: 'trip-1' } }, { data: 'recip-1' }, { count: 0 }, { error: null }]
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', recipientEmail: 'jane@b.com' }), res)
    expect(statusOf(res)).toBe('invited')
    expect(fromTables).toEqual(['trips', 'trip_share_recipients', 'trip_share_recipients'])
  })

  it('invite by active profile QR id -> invited (pending row, no email stored)', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: { id: 'recip-1' } }, { count: 0 }, { error: null }]
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', publicShareId: PROFILE_SHARE_ID }), res)
    expect(statusOf(res)).toBe('invited')
    expect(fromTables).toEqual(['trips', 'profiles', 'trip_share_recipients', 'trip_share_recipients'])
  })

  it('invite by disabled or rotated profile QR id -> not_app_user and no pending row', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: null }]
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', publicShareId: PROFILE_SHARE_ID }), res)
    expect(statusOf(res)).toBe('not_app_user')
    expect(fromTables).toEqual(['trips', 'profiles'])
  })

  it('duplicate active invite -> already_invited (deterministic)', async () => {
    queue = [{ data: { id: 'trip-1' } }, { data: 'recip-1' }, { count: 0 }, { error: { code: '23505' } }]
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', recipientEmail: 'jane@b.com' }), res)
    expect(statusOf(res)).toBe('already_invited')
  })

  it('invite over the pending limit -> invite_limit (cross-trip spam control)', async () => {
    // resolve, rpc, pending-count over the cap -> no insert
    queue = [{ data: { id: 'trip-1' } }, { data: 'recip-1' }, { count: 25 }]
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', recipientEmail: 'jane@b.com' }), res)
    expect(statusOf(res)).toBe('invite_limit')
    expect(fromTables).toEqual(['trips', 'trip_share_recipients'])
  })

  it('recipient accepts a pending invite -> accepted', async () => {
    queue = [{ data: { id: INVITE_ID } }] // update affected 1 row
    const res = mockRes()
    await handler(mockReq({ action: 'accept', inviteId: INVITE_ID }), res)
    expect(statusOf(res)).toBe('accepted')
  })

  it('accept on a non-actionable invite -> noop', async () => {
    queue = [{ data: null }] // 0 rows (already accepted/declined/revoked or not theirs)
    const res = mockRes()
    await handler(mockReq({ action: 'accept', inviteId: INVITE_ID }), res)
    expect(statusOf(res)).toBe('noop')
  })

  it('recipient declines a pending invite -> declined', async () => {
    queue = [{ data: { id: INVITE_ID } }]
    const res = mockRes()
    await handler(mockReq({ action: 'decline', inviteId: INVITE_ID }), res)
    expect(statusOf(res)).toBe('declined')
  })

  it('owner revokes an invite -> revoked; nothing to revoke -> noop', async () => {
    queue = [{ data: { id: INVITE_ID } }]
    const res1 = mockRes()
    await handler(mockReq({ action: 'revoke', inviteId: INVITE_ID }), res1)
    expect(statusOf(res1)).toBe('revoked')

    queue = [{ data: null }]
    const res2 = mockRes()
    await handler(mockReq({ action: 'revoke', inviteId: INVITE_ID }), res2)
    expect(statusOf(res2)).toBe('noop')
  })

  it('rejects a malformed request (bad email / missing fields)', async () => {
    const res = mockRes()
    await handler(mockReq({ action: 'invite', slug: 'roma', recipientEmail: 'not-an-email' }), res)
    expect(res._data.statusCode).toBe(400)
    expect(getErrorCode(res._data.body)).toBe('INVALID_REQUEST')
  })
})
