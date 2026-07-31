import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getErrorCode } from './adminAuthTypes'
import type { MockResData } from './adminAuthTypes'

vi.mock('../_server-auth.js', () => ({ requireAuthenticatedUser: vi.fn() }))

import { requireAuthenticatedUser } from '../_server-auth.js'
import { encryptShareToken } from '../_share-crypto.js'
import handler from '../send-trip-invite-email.js'

const TEST_KEY = Buffer.alloc(32, 7).toString('base64')
const OWNER = { id: 'owner-1', email: 'owner@example.com' }
const SHARE_ID = '550e8400-e29b-41d4-a716-446655440011'
const TOKEN = 'raw-share-token-1234567890-abcdef'
const ISO = '2026-07-30T10:00:00+00:00'

let queue: Array<{ data?: unknown; error?: unknown; count?: number }>
let fromTables: string[]
let rpcCalls: string[]
let envBackup: Record<string, string | undefined>

function validTrip() {
  return {
    slug: 'roma',
    title: 'Roma',
    subtitle: 'okt 15-19',
    emoji: '🇮🇹',
    startDate: '2026-10-15',
    endDate: '2026-10-19',
    people: '4 felnott',
    destination: 'Roma',
    highlights: ['Colosseum'],
    accommodation: {},
    flight: {},
    budget: {},
    urgentBookings: [],
    usefulLinks: [],
    packingList: [],
    savingTips: [],
    practicalInfo: [],
    bookingChecklist: [],
    overview: [],
    days: [{ dayNum: 1, title: 'Nap 1', schedule: [] }],
  }
}

function activeShare() {
  const enc = encryptShareToken(TOKEN)
  return {
    id: SHARE_ID,
    created_at: ISO,
    expires_at: null,
    token_ciphertext: enc.ciphertext,
    token_key_version: enc.keyVersion,
  }
}

function makeSupabase() {
  return {
    from(table: string) {
      fromTables.push(table)
      const result = queue.shift() ?? { data: null, error: null }
      const builder: Record<string, unknown> = {}
      const chain = () => builder
      for (const m of ['select', 'eq', 'gte', 'in', 'is', 'or', 'insert', 'maybeSingle', 'single']) builder[m] = chain
      builder.then = (resolve: (v: unknown) => void) => resolve(result)
      return builder
    },
    rpc(name: string) {
      rpcCalls.push(name)
      const result = queue.shift() ?? { data: null, error: null }
      return { then: (resolve: (v: unknown) => void) => resolve(result) }
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

function statusOf(res: VercelResponse & { _data: MockResData }): unknown {
  return (res._data.body as Record<string, unknown> | null)?.status
}

beforeEach(() => {
  queue = []
  fromTables = []
  rpcCalls = []
  envBackup = {
    SHARE_TOKEN_ENCRYPTION_KEY: process.env.SHARE_TOKEN_ENCRYPTION_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    INVITE_EMAIL_FROM: process.env.INVITE_EMAIL_FROM,
    APP_PUBLIC_URL: process.env.APP_PUBLIC_URL,
  }
  process.env.SHARE_TOKEN_ENCRYPTION_KEY = TEST_KEY
  process.env.RESEND_API_KEY = 're_test'
  process.env.INVITE_EMAIL_FROM = 'Az Utazasaim <noreply@example.com>'
  process.env.APP_PUBLIC_URL = 'https://app.example.com'
  vi.mocked(requireAuthenticatedUser).mockResolvedValue({
    supabase: makeSupabase() as never,
    user: OWNER as never,
  })
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
})

afterEach(() => {
  for (const [key, value] of Object.entries(envBackup)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('send-trip-invite-email endpoint', () => {
  it('fails safely when provider env is missing', async () => {
    delete process.env.RESEND_API_KEY
    queue = [{ data: { id: 'trip-1', trip_data: validTrip() } }]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'guest@example.com' }), res)
    expect(res._data.statusCode).toBe(500)
    expect(getErrorCode(res._data.body)).toBe('EMAIL_PROVIDER_NOT_CONFIGURED')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects malformed or bulk recipient requests', async () => {
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: ['a@example.com', 'b@example.com'] }), res)
    expect(res._data.statusCode).toBe(400)
    expect(getErrorCode(res._data.body)).toBe('INVALID_REQUEST')
  })

  it('requires trip ownership before sending', async () => {
    queue = [{ data: null }]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'guest@example.com' }), res)
    expect(res._data.statusCode).toBe(404)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends a public link to a non-app user without creating recipient access', async () => {
    queue = [
      { data: { id: 'trip-1', trip_data: validTrip() } },
      { data: null },
      { count: 0 },
      { count: 0 },
      { data: activeShare() },
      { data: null },
      { error: null },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'guest@example.com' }), res)
    expect(res._data.statusCode).toBe(200)
    expect(statusOf(res)).toBe('sent')
    expect(fetch).toHaveBeenCalledOnce()
    expect(fromTables).not.toContain('trip_share_recipients')
    expect(rpcCalls).toEqual(['resolve_user_id_by_email'])
  })

  it('creates only a pending account invite for an existing app user after email send', async () => {
    queue = [
      { data: { id: 'trip-1', trip_data: validTrip() } },
      { data: null },
      { count: 0 },
      { count: 0 },
      { data: activeShare() },
      { data: 'recipient-1' },
      { count: 0 },
      { error: null },
      { error: null },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'app@example.com' }), res)
    expect(statusOf(res)).toBe('sent')
    expect(fromTables.slice(-3)).toEqual(['trip_invite_email_events', 'trip_share_recipients', 'trip_share_recipients'])
  })

  it('still returns sent when account invite creation fails after provider success', async () => {
    queue = [
      { data: { id: 'trip-1', trip_data: validTrip() } },
      { data: null },
      { count: 0 },
      { count: 0 },
      { data: activeShare() },
      { data: 'recipient-1' },
      { error: null },
      { count: 0 },
      { error: { code: 'XX000', message: 'db unavailable' } },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'app@example.com' }), res)
    expect(res._data.statusCode).toBe(200)
    expect(statusOf(res)).toBe('sent')
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('returns duplicate without sending again', async () => {
    queue = [
      { data: { id: 'trip-1', trip_data: validTrip() } },
      { data: { id: 'event-1' } },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'guest@example.com' }), res)
    expect(statusOf(res)).toBe('duplicate')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rate limits by owner/trip before provider call', async () => {
    queue = [
      { data: { id: 'trip-1', trip_data: validTrip() } },
      { data: null },
      { count: 10 },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'guest@example.com' }), res)
    expect(res._data.statusCode).toBe(429)
    expect(getErrorCode(res._data.body)).toBe('EMAIL_RATE_LIMITED')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('records provider failures without exposing provider details', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    queue = [
      { data: { id: 'trip-1', trip_data: validTrip() } },
      { data: null },
      { count: 0 },
      { count: 0 },
      { data: activeShare() },
      { data: null },
      { error: null },
    ]
    const res = mockRes()
    await handler(mockReq({ slug: 'roma', recipientEmail: 'guest@example.com' }), res)
    expect(res._data.statusCode).toBe(500)
    expect(getErrorCode(res._data.body)).toBe('EMAIL_INVITE_FAILED')
  })
})
