import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { validateTripJson } from '@/lib/validateTripJson'
import { friendlyError } from '@/lib/friendlyError'
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug'
import { toSlug } from '@/lib/createTripHelpers'
import type { ImportTripJsonProps, ImportTripJsonReturn } from '@/types/hooks'

export function useImportTripJson({ refetch, navigate }: ImportTripJsonProps): ImportTripJsonReturn {
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const text = evt.target?.result
      if (typeof text !== 'string') return

      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        setError('Ervenytelen JSON fajl.')
        return
      }

      const { valid, errors, normalizedTrip } = validateTripJson(parsed)
      if (!valid) {
        setError(errors.join(' '))
        return
      }
      if (!supabase) return

      setError(null)
      setImporting(true)
      try {
        const baseSlug = normalizedTrip.slug || toSlug(normalizedTrip.title)
        const slug = await ensureUniqueSlug(baseSlug)
        const { error: insertError } = await supabase
          .from('trips')
          .insert({ slug, trip_data: { ...normalizedTrip, slug }, owner: null })
        if (insertError) {
          setError(friendlyError(insertError))
          return
        }
        await refetch()
        navigate(`/trip/${slug}`)
      } catch (err) {
        setError(friendlyError(err))
      } finally {
        setImporting(false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return { importing, error, handleImport }
}
