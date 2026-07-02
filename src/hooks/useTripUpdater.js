import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'

export function useTripUpdater({ trip, slug, refetch }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function saveTrip(updater) {
    setSaving(true)
    setError(null)

    try {
      if (!supabase) throw new Error('Supabase nincs konfigurálva.')

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
