import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import type { Trip } from '@/types/trip'
import type { TripUpdaterProps, TripUpdaterReturn } from '@/types/hooks'

export function useTripUpdater({ trip, slug, refetch }: TripUpdaterProps): TripUpdaterReturn {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function saveTrip(updater: ((trip: Trip) => Trip) | Partial<Trip>) {
    setSaving(true)
    setError(null)

    try {
      if (!supabase) throw new Error('Supabase nincs konfigurálva.')
      if (!trip || !slug) throw new Error('Nincs betöltve az utazás.')

      const updated = typeof updater === 'function' ? updater(trip) : updater
      const tripData = { ...trip, ...updated }

      const { error: dbError } = await supabase
        .from('trips')
        .update({ trip_data: tripData })
        .eq('slug', slug)

      if (dbError) throw dbError

      if (refetch) await refetch()
      return { ok: true }
    } catch (err) {
      const msg = friendlyError(err)
      setError(msg)
      return { ok: false, error: msg }
    } finally {
      setSaving(false)
    }
  }

  return { saveTrip, saving, error }
}
