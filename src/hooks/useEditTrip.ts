import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDateRange } from '@/lib/dateUtils'
import { friendlyError } from '@/lib/friendlyError'
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug'
import { toSlug } from '@/lib/createTripHelpers'
import type { EditTripProps, EditTripReturn, EditTripForm } from '@/types/hooks'

export function useEditTrip({ trip, slug, refetch, navigate }: EditTripProps): EditTripReturn {
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

      const newSlug = await ensureUniqueSlug(baseSlug, slug)

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

      const { error: updateError } = await supabase
        .from('trips')
        .update({ slug: newSlug, trip_data: updatedTripData })
        .eq('slug', slug)

      if (updateError) {
        setError(friendlyError(updateError))
        return
      }

      await refetch()
      navigate(`/trip/${newSlug}`)
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSaving(false)
    }
  }

  return { form, update, saving, error, handleSubmit }
}
