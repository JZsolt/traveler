import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { TripSchema } from '@/schemas/trip'
import { formatZodError } from '@/schemas/errors'
import { useAuth } from '@/hooks/useAuth'
import type { Trip } from '@/types/trip'
import type { TripUpdaterProps, TripUpdaterReturn } from '@/types/hooks'

export function useTripUpdater({ trip, slug, refetch }: TripUpdaterProps): TripUpdaterReturn {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function saveTrip(updater: ((trip: Trip) => Trip) | Partial<Trip>) {
    setSaving(true)
    setError(null)

    try {
      if (!supabase) throw new Error('Supabase nincs konfigurálva.')
      if (!userId) throw new Error('Bejelentkezes szukseges.')
      if (!trip || !slug) throw new Error('Nincs betöltve az utazás.')

      const updated = typeof updater === 'function' ? updater(trip) : updater
      const tripData = { ...trip, ...updated }

      const validated = TripSchema.safeParse(tripData)
      if (!validated.success) {
        throw new Error(`Ervenytelen utazas adat: ${formatZodError(validated.error)}`)
      }

      const { data, error: dbError } = await supabase
        .from('trips')
        .update({ trip_data: validated.data })
        .eq('slug', slug)
        .eq('owner_id', userId)
        .select('id')
        .maybeSingle()

      if (dbError) throw dbError
      if (!data) throw new Error('Az utazas nem talalhato vagy nincs jogosultsagod modositani.')

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
