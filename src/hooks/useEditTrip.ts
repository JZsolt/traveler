import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDateRange } from '@/lib/dateUtils'
import { friendlyError } from '@/lib/friendlyError'
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug'
import { toSlug } from '@/lib/createTripHelpers'
import { TripSchema } from '@/schemas/trip'
import { formatZodError } from '@/schemas/errors'
import { useAuth } from '@/hooks/useAuth'
import type { EditTripProps, EditTripReturn, EditTripForm } from '@/types/hooks'

export function useEditTrip({ trip, slug, refetch, navigate }: EditTripProps): EditTripReturn {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const initialForm = useMemo<EditTripForm>(() => ({
    title: trip.title || '',
    startDate: trip.startDate || '',
    endDate: trip.endDate || '',
    emoji: trip.emoji || '',
    people: trip.people || '',
  }), [trip])

  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof EditTripForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError(null)

    try {
      const baseSlug = toSlug(form.title)
      if (!baseSlug) {
        setError('A cim nem generalt ervenyes slug-ot.')
        return
      }

      if (!userId) {
        setError('Bejelentkezes szukseges.')
        return
      }

      const newSlug = await ensureUniqueSlug(baseSlug, slug, userId)

      const updatedTripData = {
        ...trip,
        slug: newSlug,
        title: form.title,
        subtitle: formatDateRange(form.startDate, form.endDate),
        startDate: form.startDate,
        endDate: form.endDate,
        emoji: form.emoji,
        people: form.people,
      }

      const validated = TripSchema.safeParse(updatedTripData)
      if (!validated.success) {
        setError(`Ervenytelen utazas adat: ${formatZodError(validated.error)}`)
        return
      }

      const { data, error: updateError } = await supabase
        .from('trips')
        .update({ slug: newSlug, trip_data: validated.data })
        .eq('slug', slug)
        .eq('owner_id', userId)
        .select('id')
        .maybeSingle()

      if (updateError) {
        setError(friendlyError(updateError))
        return
      }
      if (!data) {
        setError('Az utazas nem talalhato vagy nincs jogosultsagod modositani.')
        return
      }

      await refetch()
      navigate(`/app/trips/${newSlug}`)
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSaving(false)
    }
  }

  return { form, update, saving, error, handleSubmit }
}
