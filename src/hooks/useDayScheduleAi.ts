import { useState } from 'react'
import { API } from '@/lib/constants'
import { ExpandDayEnvelopeSchema, ChatErrorEnvelopeSchema } from '@/schemas/ai'
import type { Day } from '@/types/trip'
import type { DayScheduleAiProps, DayScheduleAiReturn, ScheduleAiPreview } from '@/types/hooks'

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
        const errEnv = ChatErrorEnvelopeSchema.safeParse(data)
        const errMsg = errEnv.success ? errEnv.data.error : 'Ismeretlen hiba.'
        const retryHint = errEnv.success && errEnv.data.retryable ? ' Próbáld újra.' : ''
        setError(errMsg + retryHint)
        return
      }
      const envelope = ExpandDayEnvelopeSchema.safeParse(data)
      if (envelope.success) {
        const { title, subtitle, schedule, costs } = envelope.data.day
        setPreview({ title, subtitle, schedule, costs })
      } else {
        setError('Hibas valasz a szervertol.')
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
