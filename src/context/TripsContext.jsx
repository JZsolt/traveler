import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const TripsContext = createContext({
  trips: [],
  loading: true,
  error: null,
})

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setError(new Error('Supabase nincs konfigurálva. Ellenőrizd a VITE_SUPABASE_URL és VITE_SUPABASE_ANON_KEY env változókat a .env.local fájlban.'))
      setLoading(false)
      return
    }

    async function fetchTrips() {
      try {
        const { data, error: fetchError } = await supabase
          .from('trips')
          .select('trip_data')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setTrips((data || []).map(row => row.trip_data))
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  return (
    <TripsContext.Provider value={{ trips, loading, error }}>
      {children}
    </TripsContext.Provider>
  )
}

export function useTrips() {
  return useContext(TripsContext)
}
