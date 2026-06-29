import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { normalizeTrip } from '@/lib/normalizeTrip'
import { friendlyError } from '@/lib/friendlyError'

const TripsContext = createContext({
  trips: [],
  loading: true,
  error: null,
  refetch: () => {},
})

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTrips = useCallback(async () => {
    if (!supabase) {
      setError(new Error('Supabase nincs konfigurálva. Ellenőrizd a VITE_SUPABASE_URL és VITE_SUPABASE_ANON_KEY env változókat a .env.local fájlban.'))
      setLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('trips')
        .select('trip_data')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setTrips((data || []).map(row => normalizeTrip(row.trip_data)))
    } catch (err) {
      setError({ message: friendlyError(err), raw: err })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  return (
    <TripsContext.Provider value={{ trips, loading, error, refetch: fetchTrips }}>
      {children}
    </TripsContext.Provider>
  )
}

export function useTrips() {
  return useContext(TripsContext)
}
