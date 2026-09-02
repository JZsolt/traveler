import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { TripSchema } from '@/schemas/trip'
import { projectPublicTrip } from '@/schemas/sharing'
import { DEMO_TRIP_SLUG } from '@/lib/constants'
import { loadDemoTrip } from '../loadDemoTrip'

// A demo utazas kezzel szerkesztett repo-adat, ezert guard teszt vedi: egy kesobbi
// kezi modositas ne tudjon torott vagy szivargo tartalmat kiszallitani.
// Lasd: docs/architecture/DEMO_TRIP_STRATEGY.md

const DEMO_FILE = path.resolve(__dirname, '../../data/demo/demo-trip.json')

// Ezek a mezok NEM lehetnek benne a fajlban — nem eleg, hogy a projekcio
// kiszurne oket (tickets/insurance = szemelyes, a tobbi belso allapot).
const FORBIDDEN_KEYS = ['tickets', 'insurance', 'status', 'aiModel', 'expandedDays', '_draft']

const MAX_FILE_BYTES = 40 * 1024

function collectKeys(value: unknown, found: Set<string>): void {
  if (Array.isArray(value)) {
    for (const entry of value) collectKeys(entry, found)
    return
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      found.add(key)
      collectKeys(nested, found)
    }
  }
}

describe('demo trip data', () => {
  const rawText = fs.readFileSync(DEMO_FILE, 'utf-8')
  const raw: unknown = JSON.parse(rawText)

  it('parses with TripSchema', () => {
    expect(TripSchema.safeParse(raw).success).toBe(true)
  })

  it('projects to a public trip', () => {
    const parsed = TripSchema.parse(raw)
    expect(() => projectPublicTrip(parsed)).not.toThrow()
  })

  it('uses the demo slug', () => {
    expect(TripSchema.parse(raw).slug).toBe(DEMO_TRIP_SLUG)
  })

  it('contains no personal or internal fields', () => {
    const keys = new Set<string>()
    collectKeys(raw, keys)
    for (const forbidden of FORBIDDEN_KEYS) {
      expect(keys.has(forbidden)).toBe(false)
    }
  })

  it('stays within the size budget', () => {
    expect(Buffer.byteLength(rawText, 'utf-8')).toBeLessThanOrEqual(MAX_FILE_BYTES)
  })

  it('loads through loadDemoTrip', async () => {
    const trip = await loadDemoTrip()
    expect(trip).not.toBeNull()
    expect(trip?.slug).toBe(DEMO_TRIP_SLUG)
    expect(trip?.days.length).toBeGreaterThan(0)
  })
})
