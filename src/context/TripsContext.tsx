import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { TripsContext } from './tripsContextValue'
import { supabase } from '@/lib/supabase'
import { normalizeTrip } from '@/lib/normalizeTrip'
import { friendlyError } from '@/lib/friendlyError'
import { useAuth } from '@/hooks/useAuth'
import type { Trip } from '@/types/trip'
import type { TripsError, TripsProviderProps } from '@/types/trips'

export function TripsProvider({ children }: TripsProviderProps) {
  const { user, isLoading: authLoading } = useAuth()
  const userId = user?.id ?? null
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<TripsError | null>(null)
  const [prevUserId, setPrevUserId] = useState<string | null>(null)
  const mountedRef = useRef(false)
  const requestIdRef = useRef(0)

  if (userId !== prevUserId) {
    setPrevUserId(userId)
    setTrips([])
    setError(null)
    setLoading(!!userId)
  }

  const loadTrips = useCallback(async () => {
    if (!userId) {
      setTrips([])
      setError(null)
      setLoading(false)
      return
    }

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
        .eq('owner_id', userId)
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
  }, [userId])

  useEffect(() => {
    if (authLoading || !userId) {
      requestIdRef.current += 1
      return
    }

    mountedRef.current = true

    queueMicrotask(() => {
      if (mountedRef.current) void loadTrips()
    })

    return () => {
      mountedRef.current = false
      requestIdRef.current += 1
    }
  }, [userId, authLoading, loadTrips])

  const value = useMemo(() => ({
    trips, loading, error, refetch: loadTrips,
  }), [trips, loading, error, loadTrips])

  return (
    <TripsContext.Provider value={value}>
      {children}
    </TripsContext.Provider>
  )
}
