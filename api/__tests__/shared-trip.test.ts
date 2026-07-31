import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getErrorCode } from './adminAuthTypes'
import type { MockResData } from './adminAuthTypes'

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }))

import { createClient } from '@supabase/supabase-js'
import handler from '../shared-trip.js'
import { hashShareToken } from '../_share-token.js'

const TOKEN = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

let queue: Array<{ data?: unknown; error?: unknown }>
let filters: Array<{ method: string; args: unknown[] }>
let fromTables: string[]
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
    accommodation: { doorCode: '1234', privateNote: 'belső' },
    flight: {},
    budget: {},
    urgentBookings: [],
    usefulLinks: [],
    packingList: [],
    savingTips: [],
    practicalInfo: [],
    bookingChecklist: [],
    insurance: { pdf: 'biztositas.pdf', label: 'B', desc: 'c' },
    overview: [],
    days: [{ dayNum: 1, title: 'Nap 1', schedule: [], tickets: [{ label: 'jegy', desc: 'x' }] }],
  }
}

function makeSupabase() {
  return {
    from(table: string) {
      fromTables.push(table)
      const result = queue.shift() ?? { data: null, error: null }
      const builder: Record<string, unknown> = {}
      const chain = (method: string) => (...args: unknown[]) => {
        filters.push({ method, args })
        return builder
      }
      for (const m of ['select', 'eq', 'is', 'or', 'limit', 'maybeSingle']) builder[m] = chain(m)
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
  filters = []
  fromTables = []
  envBackup = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
  process.env.SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
  vi.mocked(createClient).mockReturnValue(makeSupabase() as unknown as ReturnType<typeof createClient>)
})

afterEach(() => {
  for (const [key, value] of Object.entries(envBackup)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  vi.restoreAllMocks()
})

describe('shared-trip endpoint', () => {
  it('returns the same 404 for malformed/too-short tokens', async () => {
    const res = mockRes()
    await handler(mockReq({ token: 'short' }), res)
    expect(res._data.statusCode).toBe(404)
    expect(getErrorCode(res._data.body)).toBe('SHARE_NOT_FOUND')
    expect(fromTables).toEqual([])
  })

  it('looks up shares by token hash, never by raw token', async () => {
    queue = [{ data: null }]
    const res = mockRes()
    await handler(mockReq({ token: TOKEN }), res)
    expect(res._data.statusCode).toBe(404)
    expect(fromTables).toEqual(['trip_shares'])
    expect(filters).toContainEqual({ method: 'eq', args: ['token_hash', hashShareToken(TOKEN)] })
    expect(filters).not.toContainEqual({ method: 'eq', args: ['token_hash', TOKEN] })
  })

  it('returns only public projected trip data for a valid share', async () => {
    queue = [
      { data: { trip_id: 'trip-1' } },
      { data: { trip_data: validTrip() } },
    ]
    const res = mockRes()
    await handler(mockReq({ token: TOKEN }), res)
    expect(res._data.statusCode).toBe(200)
    const trip = body(res).trip as Record<string, unknown>
    expect(trip.title).toBe('Roma')
    expect('insurance' in trip).toBe(false)
    expect('privateNote' in (trip.accommodation as Record<string, unknown>)).toBe(false)
    expect('tickets' in (trip.days as Array<Record<string, unknown>>)[0]).toBe(false)
  })
})
