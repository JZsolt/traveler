import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { DEFAULT_AI_MODEL, API } from '@/lib/constants'

export function useExpandDay({ trip, slug, refetch }) {
  const [expandingDay, setExpandingDay] = useState(null)
  const [error, setError] = useState(null)
  const [prompts, setPrompts] = useState({})
  const [models, setModels] = useState({})

  const expandedDays = trip?.expandedDays || []

  function setPrompt(dayNum, value) {
    setPrompts(prev => ({ ...prev, [dayNum]: value }))
  }

  function setModel(dayNum, value) {
    setModels(prev => ({ ...prev, [dayNum]: value }))
  }

  async function expandDay(dayNum) {
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

      const data = await res.json()

      if (res.status === 429) {
        setError(friendlyError(data.error || '429'))
        return
      }
      if (!res.ok) {
        setError(friendlyError(data.error))
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
