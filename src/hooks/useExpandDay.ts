import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { DEFAULT_AI_MODEL, API } from '@/lib/constants'
import type { ExpandDayProps, ExpandDayReturn } from '@/types/hooks'
import { isDay } from '@/types/guards'

function isObjectWithKey(val: unknown, key: string): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && key in val
}

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

      if (res.status === 429) {
        const errMsg = isObjectWithKey(data, 'error') && typeof data.error === 'string' ? data.error : '429'
        setError(friendlyError(errMsg))
        return
      }
      if (!res.ok) {
        const errMsg = isObjectWithKey(data, 'error') && typeof data.error === 'string' ? data.error : ''
        setError(friendlyError(errMsg))
        return
      }

      if (!isObjectWithKey(data, 'day') || !isDay(data.day)) {
        setError('Hibas valasz a szervertol.')
        return
      }

      const expandedDay = { ...data.day, _draft: false }
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

      const { error: updateError } = await supabase
        .from('trips')
        .update({ trip_data: updatedTripData })
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
