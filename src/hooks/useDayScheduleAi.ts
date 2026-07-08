import { useState } from 'react'
import { API } from '@/lib/constants'
import type { Day } from '@/types/trip'
import type { ScheduleAiPreview, DayScheduleAiProps, DayScheduleAiReturn } from '@/types/hooks'
import { isScheduleAiPreview } from '@/types/guards'

function isObjectWithKey(val: unknown, key: string): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && key in val
}

export function useDayScheduleAi({ day, trip, saveTrip, updateTripDay }: DayScheduleAiProps): DayScheduleAiReturn {
  const [showPanel, setShowPanel] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<ScheduleAiPreview | null>(null)
  const [pendingDraft, setPendingDraft] = useState<Partial<Day> | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    setPreview(null)
    try {
      const currentDay = {
        title: day.title || '',
        summary: day.subtitle || '',
        items: (day.schedule || []).map(s => ({
          time: s.time || '',
          title: s.title || '',
          type: s.highlight ? 'sight' : 'activity',
          note: s.desc || '',
        })),
      }
      const res = await fetch(API.EXPAND_DAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripTitle: trip.title,
          destination: trip.destination || trip.title,
          dayNumber: day.dayNum,
          currentDay,
          people: trip.people,
          instruction: instruction.trim() || undefined,
        }),
      })
      const data: unknown = await res.json()
      if (!res.ok) {
        const errMsg = isObjectWithKey(data, 'error') && typeof data.error === 'string' ? data.error : 'Ismeretlen hiba.'
        const retryable = isObjectWithKey(data, 'retryable') && data.retryable === true
        const retryHint = retryable ? ' Próbáld újra.' : ''
        setError(errMsg + retryHint)
        return
      }
      if (isObjectWithKey(data, 'day') && isScheduleAiPreview(data.day)) {
        setPreview(data.day)
      }
    } catch {
      setError('Hálózati hiba. Ellenőrizd az internet kapcsolatot.')
    } finally {
      setLoading(false)
    }
  }

  function applyPreview() {
    if (!preview?.schedule) return
    setPendingDraft({
      title: preview.title || day.title,
      subtitle: preview.subtitle || day.subtitle,
      schedule: preview.schedule,
      costs: preview.costs || day.costs,
    })
    setPreview(null)
    setShowPanel(false)
  }

  async function saveDraft() {
    if (!pendingDraft) return
    const result = await saveTrip(t => updateTripDay(t, day.dayNum, pendingDraft))
    if (result.ok) setPendingDraft(null)
  }

  function discardDraft() {
    setPendingDraft(null)
  }

  return {
    showPanel,
    togglePanel: () => setShowPanel(s => !s),
    instruction,
    setInstruction,
    loading,
    error,
    preview,
    clearPreview: () => setPreview(null),
    pendingDraft,
    generate,
    applyPreview,
    saveDraft,
    discardDraft,
  }
}
