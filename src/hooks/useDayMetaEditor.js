import { useState, useRef } from 'react'

export function useDayMetaEditor({ day, saveTrip, updateTripDay }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showAi, setShowAi] = useState(false)
  const initialDraft = useRef(null)

  function startEdit(e) {
    e?.stopPropagation()
    const d = { title: day.title || '', subtitle: day.subtitle || '' }
    initialDraft.current = JSON.stringify(d)
    setDraft(d)
    setEditing(true)
  }

  function cancel(e) {
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

  async function save(e) {
    e?.stopPropagation()
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
