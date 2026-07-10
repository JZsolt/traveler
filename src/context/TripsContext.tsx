import { useState, useEffect, useCallback, useRef } from 'react'
import { TripsContext } from './tripsContextValue'
import { supabase } from '@/lib/supabase'
import { normalizeTrip } from '@/lib/normalizeTrip'
import { friendlyError } from '@/lib/friendlyError'
import type { Trip } from '@/types/trip'
import type { TripsError, TripsProviderProps } from '@/types/trips'

export function TripsProvider({ children }: TripsProviderProps) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<TripsError | null>(null)
  const mountedRef = useRef(false)
  const requestIdRef = useRef(0)

  const loadTrips = useCallback(async () => {
    const requestId = ++requestIdRef.current
    const isCurrentRequest = () => mountedRef.current && requestId === requestIdRef.current

    if (!supabase) {
      if (isCurrentRequest()) {
        setError({ message: 'Supabase nincs konfigurálva. Ellenőrizd a VITE_SUPABASE_URL és VITE_SUPABASE_ANON_KEY env változókat a .env.local fájlban.', raw: null })
        setLoading(false)
      }
      return
    }

    if (isCurrentRequest()) {
      setLoading(true)
      setError(null)
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('trips')
        .select('trip_data')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      if (isCurrentRequest()) {
        const normalized = (data || []).map(row => normalizeTrip(row.trip_data))
        const valid = normalized.filter(trip => trip.slug !== '')
        const skipped = normalized.length - valid.length
        if (skipped > 0) {
          console.warn(`[TripsContext] ${skipped} invalid trip(s) skipped`)
        }
        setTrips(valid)
      }
    } catch (err) {
      if (isCurrentRequest()) {
        setError({ message: friendlyError(err), raw: err })
      }
    } finally {
      if (isCurrentRequest()) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    mountedRef.current = true

    queueMicrotask(() => {
      if (!cancelled) void loadTrips()
    })

    return () => {
      cancelled = true
      mountedRef.current = false
      requestIdRef.current += 1
    }
  }, [loadTrips])

  return (
    <TripsContext.Provider value={{ trips, loading, error, refetch: loadTrips }}>
      {children}
    </TripsContext.Provider>
  )
}
