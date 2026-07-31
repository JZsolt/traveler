import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getErrorCode } from './adminAuthTypes'
import type { MockResData } from './adminAuthTypes'

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }))

import { createClient } from '@supabase/supabase-js'
import { requireAuthenticatedUser } from '../_server-auth.js'

const VALID_TOKEN = 'valid-jwt-token'

function mockReq(authHeader?: string | null): VercelRequest {
  const headers: Record<string, string | undefined> = {}
  if (authHeader !== null && authHeader !== undefined) headers.authorization = authHeader
  return { headers } as unknown as VercelRequest
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

function mockGetUser(user: { id: string } | null, error: Error | null = null) {
  const client = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user }, error }) } }
  vi.mocked(createClient).mockReturnValue(client as unknown as ReturnType<typeof createClient>)
  return client
}

const ENV_KEYS = ['SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
const backup: Record<string, string | undefined> = {}

beforeEach(() => {
  for (const key of ENV_KEYS) backup[key] = process.env[key]
  process.env.SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
  delete process.env.VITE_SUPABASE_URL
})

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (backup[key] === undefined) delete process.env[key]
    else process.env[key] = backup[key]
  }
  vi.restoreAllMocks()
})

// A megosztas owner-endpointjai (trip-share-management) ezen a kapun mennek at.
// Ha ez elutasit, a hivo SOHA nem er el trip/ownership logikat — ez a hataroja
// annak, hogy anonim/ervenytelen (es a puszta share-token birtokosa) nem kap
// owner jogot.
describe('requireAuthenticatedUser — auth gate before any trip logic', () => {
  it('returns null + 500 when Supabase env is missing', async () => {
    delete process.env.SUPABASE_URL
    delete process.env.VITE_SUPABASE_URL
    const res = mockRes()
    const ctx = await requireAuthenticatedUser(mockReq(`Bearer ${VALID_TOKEN}`), res)
    expect(ctx).toBeNull()
    expect(res._data.statusCode).toBe(500)
    expect(getErrorCode(res._data.body)).toBe('MISSING_SUPABASE_ENV')
  })

  it('rejects an anonymous request (no Authorization header) with 401', async () => {
    const res = mockRes()
    const ctx = await requireAuthenticatedUser(mockReq(null), res)
    expect(ctx).toBeNull()
    expect(res._data.statusCode).toBe(401)
    expect(getErrorCode(res._data.body)).toBe('MISSING_AUTH')
  })

  it('rejects a non-Bearer scheme with 401', async () => {
    const res = mockRes()
    const ctx = await requireAuthenticatedUser(mockReq('Basic abc123'), res)
    expect(ctx).toBeNull()
    expect(getErrorCode(res._data.body)).toBe('MISSING_AUTH')
  })

  it('rejects an invalid/expired token with 401', async () => {
    mockGetUser(null, new Error('invalid jwt'))
    const res = mockRes()
    const ctx = await requireAuthenticatedUser(mockReq(`Bearer ${VALID_TOKEN}`), res)
    expect(ctx).toBeNull()
    expect(res._data.statusCode).toBe(401)
    expect(getErrorCode(res._data.body)).toBe('INVALID_TOKEN')
  })

  it('accepts a valid Bearer token and returns the authenticated context', async () => {
    mockGetUser({ id: 'user-1' })
    const res = mockRes()
    const ctx = await requireAuthenticatedUser(mockReq(`Bearer ${VALID_TOKEN}`), res)
    expect(ctx).not.toBeNull()
    expect(ctx?.user.id).toBe('user-1')
    expect(res._data.statusCode).toBe(0)
  })

  it('accepts a case-insensitive bearer scheme', async () => {
    mockGetUser({ id: 'user-1' })
    const res = mockRes()
    const ctx = await requireAuthenticatedUser(mockReq(`bearer ${VALID_TOKEN}`), res)
    expect(ctx).not.toBeNull()
    expect(ctx?.user.id).toBe('user-1')
  })
})
