import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ApiRequest, ApiResponse } from '../../src/types/http'
import type { MockResData } from './adminAuthTypes'

vi.mock('../_server-auth.js', () => ({ requireAuthenticatedUser: vi.fn() }))

import { requireAuthenticatedUser } from '../_server-auth.js'
import handler from '../_shared-with-me-route.js'

const USER = { id: 'recipient-1' }
const ISO = '2026-07-30T10:00:00+00:00'
const ACCEPTED_INVITE_ID = '550e8400-e29b-41d4-a716-446655440066'
const PENDING_INVITE_ID = '550e8400-e29b-41d4-a716-446655440077'

// Teljes, valid Trip — insurance + tickets-szel, hogy a projekcio strip-jet igazoljuk.
function validTrip(over: Record<string, unknown> = {}) {
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
    accommodation: { doorCode: '1234' },
    flight: { airport: 'FCO' },
    budget: { headline: 'x' },
    urgentBookings: [],
    usefulLinks: [],
    packingList: [],
    savingTips: [],
    practicalInfo: [],
    bookingChecklist: [],
    insurance: { pdf: 'a.pdf', label: 'B', desc: 'c' },
    overview: [{ day: 1, date: '2026-10-15', program: 'x', highlights: 'y' }],
    days: [{
      dayNum: 1,
      title: 'Nap 1',
      schedule: [{ time: '10:00', title: 'Colosseum' }],
      tickets: [{ label: 'jegy', desc: 'y' }],
    }],
    ...over,
  }
}

let queue: Array<{ data?: unknown; error?: unknown }>

function makeSupabase() {
  return {
    from() {
      const result = queue.shift() ?? { data: null, error: null }
      const builder: Record<string, unknown> = {}
      const chain = () => builder
      for (const m of ['select', 'eq', 'is', 'in', 'or', 'lt', 'single', 'maybeSingle']) {
        builder[m] = chain
      }
      builder.then = (resolve: (v: unknown) => void) => resolve(result)
      return builder
    },
  }
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

function getReq(): ApiRequest {
  return { method: 'GET', headers: {} } as unknown as ApiRequest
}

function body(res: ApiResponse & { _data: MockResData }): Record<string, unknown> {
  return (res._data.body ?? {}) as Record<string, unknown>
}

beforeEach(() => {
  queue = []
  vi.mocked(requireAuthenticatedUser).mockResolvedValue({
    supabase: makeSupabase() as never,
    user: USER as never,
  })
})

afterEach(() => vi.restoreAllMocks())

describe('shared-with-me endpoint', () => {
  it('rejects non-GET methods', async () => {
    const res = mockRes()
    await handler({ method: 'POST', headers: {} } as unknown as ApiRequest, res)
    expect(res._data.statusCode).toBe(405)
  })

  it('returns empty arrays when the recipient has no invites', async () => {
    queue = [{ data: [] }]
    const res = mockRes()
    await handler(getReq(), res)
    expect(res._data.statusCode).toBe(200)
    expect(body(res).sharedTrips).toEqual([])
    expect(body(res).pendingInvites).toEqual([])
    expect(body(res).unavailableCount).toBe(0)
  })

  it('surfaces an accepted trip with invalid trip_data as unavailable (no silent drop)', async () => {
    queue = [
      { data: [{ id: 'inv-1', trip_id: 'trip-X', accepted_at: ISO }] },
      { data: [{ id: 'trip-X', trip_data: { bogus: true } }] }, // fails TripSchema
    ]
    const res = mockRes()
    await handler(getReq(), res)
    expect(res._data.statusCode).toBe(200)
    expect(body(res).sharedTrips).toEqual([])
    expect(body(res).unavailableCount).toBe(1)
  })

  it('projects accepted trips and strips private fields; pending is a minimal teaser', async () => {
    queue = [
      // recipient rows: one accepted, one pending
      { data: [
        { id: ACCEPTED_INVITE_ID, trip_id: 'trip-A', accepted_at: ISO },
        { id: PENDING_INVITE_ID, trip_id: 'trip-B', accepted_at: null },
      ] },
      // trips.trip_data for both
      { data: [
        { id: 'trip-A', trip_data: validTrip({ title: 'Elfogadott' }) },
        { id: 'trip-B', trip_data: validTrip({ title: 'Fuggo' }) },
      ] },
    ]
    const res = mockRes()
    await handler(getReq(), res)
    expect(res._data.statusCode).toBe(200)

    const shared = body(res).sharedTrips as Array<Record<string, unknown>>
    expect(shared).toHaveLength(1)
    expect(shared[0].inviteId).toBe(ACCEPTED_INVITE_ID)
    const sharedTrip = shared[0].trip as Record<string, unknown>
    expect(sharedTrip.title).toBe('Elfogadott')
    // Projekcio strip: privat mezok nem szivarognak
    expect('insurance' in sharedTrip).toBe(false)
    expect('tickets' in (sharedTrip.days as Array<Record<string, unknown>>)[0]).toBe(false)

    const pending = body(res).pendingInvites as Array<Record<string, unknown>>
    expect(pending).toHaveLength(1)
    expect(pending[0].inviteId).toBe(PENDING_INVITE_ID)
    expect(pending[0].title).toBe('Fuggo')
    // Teaser: NINCS teljes itinerary a fuggo meghivasban
    expect('days' in pending[0]).toBe(false)
    expect('accommodation' in pending[0]).toBe(false)

    expect(body(res).unavailableCount).toBe(0)
  })
})
