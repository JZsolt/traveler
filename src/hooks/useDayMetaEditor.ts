import { useState, useRef } from 'react'
import type { MouseEvent } from 'react'
import type { DayMetaDraft, DayMetaEditorProps, DayMetaEditorReturn } from '@/types/hooks'

export function useDayMetaEditor({ day, saveTrip, updateTripDay }: DayMetaEditorProps): DayMetaEditorReturn {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<DayMetaDraft | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showAi, setShowAi] = useState(false)
  const initialDraft = useRef<string | null>(null)

  function startEdit(e?: MouseEvent) {
    e?.stopPropagation()
    const d: DayMetaDraft = { title: day.title || '', subtitle: day.subtitle || '' }
    initialDraft.current = JSON.stringify(d)
    setDraft(d)
    setEditing(true)
  }

  function cancel(e?: MouseEvent) {
    e?.stopPropagation()
    const isDirty = draft && JSON.stringify(draft) !== initialDraft.current
    if (isDirty && !confirmCancel) {
      setConfirmCancel(true)
      return
    }
    setDraft(null)
    setEditing(false)
    setShowAi(false)
    setConfirmCancel(false)
  }

  async function save(e?: MouseEvent) {
    e?.stopPropagation()
    if (!draft) return
    const result = await saveTrip(t => updateTripDay(t, day.dayNum, { title: draft.title, subtitle: draft.subtitle }))
    if (result.ok) {
      setDraft(null)
      setEditing(false)
    }
    return result
  }

  return {
    editing,
    draft,
    setDraft,
    confirmCancel,
    setConfirmCancel,
    showAi,
    toggleAi: () => setShowAi(s => !s),
    startEdit,
    cancel,
    save,
  }
}
