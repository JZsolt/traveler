import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { MockResData } from './adminAuthTypes'

vi.mock('../_server-auth.js', () => ({ requireAuthenticatedUser: vi.fn() }))

import { requireAuthenticatedUser } from '../_server-auth.js'
import handler from '../_profile-share-management-route.js'

const USER = { id: '550e8400-e29b-41d4-a716-446655440001' }
const SHARE_ID = 'abcdefghijklmnopqrstuvwxyzABCDEF'

let queue: Array<{ data?: unknown; error?: unknown }>
let fromTables: string[]

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
      for (const m of ['select', 'eq', 'insert', 'update', 'maybeSingle']) builder[m] = chain
      builder.then = (resolve: (v: unknown) => void) => resolve(result)
      return builder
    },
  }
}

function mockReq(body: unknown): VercelRequest {
  return { method: 'POST', headers: {}, body } as unknown as VercelRequest
}

function mockRes(): VercelResponse & { _data: MockResData } {
  const data: MockResData = { statusCode: 0, body: null }
  const res = {
    _data: data,
    status(code: number) { data.statusCode = code; return this },
    json(body: unknown) { data.body = body; return this },
  }
  return res as unknown as VercelResponse & { _data: MockResData }
}

function body(res: VercelResponse & { _data: MockResData }): Record<string, unknown> {
  return (res._data.body ?? {}) as Record<string, unknown>
}

beforeEach(() => {
  queue = []
  fromTables = []
  vi.mocked(requireAuthenticatedUser).mockResolvedValue({
    supabase: makeSupabase() as never,
    user: USER as never,
  })
})

afterEach(() => vi.restoreAllMocks())

describe('profile-share-management endpoint', () => {
  it('returns disabled empty state by default', async () => {
    queue = [{ data: { public_share_id: null, profile_share_enabled: false, profile_share_rotated_at: null } }]
    const res = mockRes()
    await handler(mockReq({ action: 'get' }), res)
    expect(res._data.statusCode).toBe(200)
    expect(body(res).profileShare).toEqual({ enabled: false, publicShareId: null, rotatedAt: null })
  })

  it('enables profile QR with a non-guessable server-generated id', async () => {
    queue = [
      { data: { public_share_id: null, profile_share_enabled: false, profile_share_rotated_at: null } },
      { data: { public_share_id: SHARE_ID, profile_share_enabled: true, profile_share_rotated_at: '2026-07-30T10:00:00.000Z' } },
    ]
    const res = mockRes()
    await handler(mockReq({ action: 'enable' }), res)
    const profileShare = body(res).profileShare as Record<string, unknown>
    expect(res._data.statusCode).toBe(200)
    expect(profileShare.enabled).toBe(true)
    expect(typeof profileShare.publicShareId).toBe('string')
    expect((profileShare.publicShareId as string).length).toBeGreaterThanOrEqual(32)
    expect(fromTables).toEqual(['profiles', 'profiles'])
  })

  it('disables profile QR without deleting the current id', async () => {
    queue = [
      { data: { public_share_id: SHARE_ID, profile_share_enabled: true, profile_share_rotated_at: null } },
      { data: { public_share_id: SHARE_ID, profile_share_enabled: false, profile_share_rotated_at: null } },
    ]
    const res = mockRes()
    await handler(mockReq({ action: 'disable' }), res)
    expect(body(res).profileShare).toEqual({ enabled: false, publicShareId: SHARE_ID, rotatedAt: null })
  })

  it('rotates profile QR by replacing the public id and keeping sharing enabled', async () => {
    const rotated = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef'
    queue = [{ data: { public_share_id: rotated, profile_share_enabled: true, profile_share_rotated_at: '2026-07-30T11:00:00.000Z' } }]
    const res = mockRes()
    await handler(mockReq({ action: 'rotate' }), res)
    const profileShare = body(res).profileShare as Record<string, unknown>
    expect(profileShare.enabled).toBe(true)
    expect(profileShare.publicShareId).toBe(rotated)
  })

  it('rejects malformed actions', async () => {
    const res = mockRes()
    await handler(mockReq({ action: 'delete' }), res)
    expect(res._data.statusCode).toBe(400)
  })
})
