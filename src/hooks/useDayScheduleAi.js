import { useState } from 'react'
import { API } from '@/lib/constants'

export function useDayScheduleAi({ day, trip, saveTrip, updateTripDay }) {
  const [showPanel, setShowPanel] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [pendingDraft, setPendingDraft] = useState(null)

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
      const data = await res.json()
      if (!res.ok) {
        const retryHint = data.retryable ? ' Próbáld újra.' : ''
        setError((data.error || 'Ismeretlen hiba.') + retryHint)
        return
      }
      setPreview(data.day)
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
