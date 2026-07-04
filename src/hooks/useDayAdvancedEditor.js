import { useState, useRef } from 'react'

const FIELDS = ['images', 'tickets', 'alerts', 'transportOptions', 'costs', 'endAlerts']

export function useDayAdvancedEditor({ day, saveTrip, updateTripDay }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [errors, setErrors] = useState({})
  const [confirmCancel, setConfirmCancel] = useState(false)
  const initialDraft = useRef(null)

  function startEdit() {
    const stringify = v => v ? JSON.stringify(v, null, 2) : ''
    const d = {}
    for (const f of FIELDS) d[f] = stringify(day[f])
    initialDraft.current = JSON.stringify(d)
    setDraft(d)
    setEditing(true)
  }

  function cancel() {
    if (draft && JSON.stringify(draft) !== initialDraft.current) {
      if (!confirmCancel) { setConfirmCancel(true); return }
    }
    setDraft(null)
    setErrors({})
    setEditing(false)
    setConfirmCancel(false)
  }

  function dismissCancel() {
    setConfirmCancel(false)
  }

  async function save() {
    const errs = {}
    const parsed = {}
    for (const field of FIELDS) {
      const val = draft[field].trim()
      if (!val) { parsed[field] = undefined; continue }
      try { parsed[field] = JSON.parse(val) } catch { errs[field] = 'Érvénytelen JSON' }
    }
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    const result = await saveTrip(t => updateTripDay(t, day.dayNum, parsed))
    if (result.ok) { setDraft(null); setEditing(false) }
  }

  function updateField(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }))
  }

  return {
    editing,
    draft,
    errors,
    confirmCancel,
    fields: FIELDS,
    startEdit,
    cancel,
    dismissCancel,
    save,
    updateField,
  }
}
