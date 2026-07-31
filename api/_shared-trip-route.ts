import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import {
  SharedTripRequestSchema,
  PublicSharedTripResponseSchema,
  projectPublicTrip,
} from '../src/schemas/sharing.js'
import { TripSchema } from '../src/schemas/trip.js'
import { hashShareToken } from './_share-token.js'
import type { Database } from '../src/types/supabase'

// Egyseges, kontrollalt "nem talalhato" valasz. Szandekosan NEM tesz kulonbseget
// random / lejart / visszavont token kozott, hogy ne szivarogtassa, letezik-e
// egyaltalan privat utazas az adott tokenhez.
const NOT_FOUND = { status: 404, code: 'SHARE_NOT_FOUND', message: 'A megosztasi link ervenytelen vagy lejart.' } as const

function jsonError(res: VercelResponse, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Nem tamogatott HTTP metodus.')
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return jsonError(res, 500, 'MISSING_SUPABASE_ENV', 'Supabase nincs konfiguralva a szerveren.')
  }

  const body = SharedTripRequestSchema.safeParse(req.body)
  if (!body.success) {
    // Formailag hibas token -> ugyanaz a kontrollalt not-found, nincs 400-as jelzes.
    return jsonError(res, NOT_FOUND.status, NOT_FOUND.code, NOT_FOUND.message)
  }

  const tokenHash = hashShareToken(body.data.token)
  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  const nowIso = new Date().toISOString()
  const { data: share, error: shareError } = await supabase
    .from('trip_shares')
    .select('trip_id')
    .eq('token_hash', tokenHash)
    .is('revoked_at', null)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .limit(1)
    .maybeSingle()

  if (shareError) {
    console.error('[shared-trip] share lookup failed', { code: shareError.code })
    return jsonError(res, 500, 'SHARE_LOOKUP_FAILED', 'Nem sikerult betolteni a megosztast.')
  }

  if (!share) {
    return jsonError(res, NOT_FOUND.status, NOT_FOUND.code, NOT_FOUND.message)
  }

  const { data: tripRow, error: tripError } = await supabase
    .from('trips')
    .select('trip_data')
    .eq('id', share.trip_id)
    .maybeSingle()

  if (tripError) {
    console.error('[shared-trip] trip load failed', { code: tripError.code })
    return jsonError(res, 500, 'TRIP_LOAD_FAILED', 'Nem sikerult betolteni az utazast.')
  }

  // Share letezik, de a trip idokozben torlodott (FK cascade eleve vedi) ->
  // ugyanaz a kontrollalt not-found.
  if (!tripRow) {
    return jsonError(res, NOT_FOUND.status, NOT_FOUND.code, NOT_FOUND.message)
  }

  // Boundary: a nyers trip_data unknown, csak Zod utan mehet domain kodba.
  const tripData = TripSchema.safeParse(tripRow.trip_data)
  if (!tripData.success) {
    console.error('[shared-trip] trip_data invalid for shared trip')
    return jsonError(res, 500, 'TRIP_INVALID', 'Az utazas adatai ervenytelenek.')
  }

  const response = PublicSharedTripResponseSchema.safeParse({
    ok: true,
    trip: projectPublicTrip(tripData.data),
  })

  if (!response.success) {
    console.error('[shared-trip] response validation failed')
    return jsonError(res, 500, 'INVALID_RESPONSE', 'Nem sikerult ervenyes valaszt osszeallitani.')
  }

  return res.status(200).json(response.data)
}
