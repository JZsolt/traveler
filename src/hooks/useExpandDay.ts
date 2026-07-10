import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { DEFAULT_AI_MODEL, API } from '@/lib/constants'
import { TripSchema } from '@/schemas/trip'
import { formatZodError } from '@/schemas/errors'
import { ExpandDayEnvelopeSchema, ChatErrorEnvelopeSchema } from '@/schemas/ai'
import type { ExpandDayProps, ExpandDayReturn } from '@/types/hooks'

export function useExpandDay({ trip, slug, refetch }: ExpandDayProps): ExpandDayReturn {
  const [expandingDay, setExpandingDay] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Record<number, string>>({})
  const [models, setModels] = useState<Record<number, string>>({})

  const expandedDays = trip?.expandedDays || []

  function setPrompt(dayNum: number, value: string) {
    setPrompts(prev => ({ ...prev, [dayNum]: value }))
  }

  function setModel(dayNum: number, value: string) {
    setModels(prev => ({ ...prev, [dayNum]: value }))
  }

  async function expandDay(dayNum: number) {
    if (!trip || !slug) return
    const day = trip.days.find(d => d.dayNum === dayNum)
    if (!day) return

    setExpandingDay(dayNum)
    setError(null)

    try {
      const res = await fetch(API.EXPAND_DAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripTitle: trip.title,
          destination: trip.destination || '',
          dayNumber: dayNum,
          currentDay: {
            title: day.title,
            summary: day.subtitle || '',
            items: (day.schedule || []).map(s => ({
              time: s.time,
              title: s.title,
              type: s.badges?.includes('ETTEREM') ? 'food' : 'sight',
              note: s.desc,
            })),
          },
          people: trip.people || '',
          model: models[dayNum] || trip.aiModel || DEFAULT_AI_MODEL,
          instruction: prompts[dayNum] || '',
        }),
      })

      const data: unknown = await res.json()

      const errEnv = ChatErrorEnvelopeSchema.safeParse(data)
      if (res.status === 429) {
        setError(friendlyError(errEnv.success ? errEnv.data.error : '429'))
        return
      }
      if (!res.ok) {
        setError(friendlyError(errEnv.success ? errEnv.data.error : ''))
        return
      }

      const envelope = ExpandDayEnvelopeSchema.safeParse(data)
      if (!envelope.success) {
        setError('Hibas valasz a szervertol.')
        return
      }

      const expandedDay = { ...envelope.data.day, _draft: false }
      const updatedDays = trip.days.map(d =>
        d.dayNum === dayNum ? { ...d, ...expandedDay } : d
      )
      const updatedExpandedDays = [...expandedDays, dayNum]
      const allExpanded = updatedExpandedDays.length >= trip.days.length
      const updatedTripData = {
        ...trip,
        days: updatedDays,
        expandedDays: updatedExpandedDays,
        status: allExpanded ? 'complete' : 'draft',
      }

      if (!supabase) {
        setError('Supabase nincs konfigurálva.')
        return
      }

      const validated = TripSchema.safeParse(updatedTripData)
      if (!validated.success) {
        setError(`Ervenytelen utazas adat: ${formatZodError(validated.error)}`)
        return
      }

      const { error: updateError } = await supabase
        .from('trips')
        .update({ trip_data: validated.data })
        .eq('slug', slug)

      if (updateError) {
        setError(friendlyError(updateError))
        return
      }

      await refetch()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setExpandingDay(null)
    }
  }

  return {
    expandingDay,
    expandError: error,
    expandPrompts: prompts,
    expandModels: models,
    expandedDays,
    setExpandPrompt: setPrompt,
    setExpandModel: setModel,
    expandDay,
  }
}
