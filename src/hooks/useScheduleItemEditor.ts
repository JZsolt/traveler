import { useState, useRef } from 'react'
import type { ScheduleItemDraft, ScheduleItemEditorProps, ScheduleItemEditorReturn } from '@/types/hooks'

export function useScheduleItemEditor({ item, onSave }: ScheduleItemEditorProps): ScheduleItemEditorReturn {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ScheduleItemDraft | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showItemAi, setShowItemAi] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const initialDraft = useRef<string | null>(null)

  function startEdit() {
    const g = item.guide || {}
    const d: ScheduleItemDraft = {
      time: item.time || '',
      title: item.title || '',
      desc: item.desc || '',
      highlight: !!item.highlight,
      optional: !!item.optional,
      badges: [...(item.badges || [])],
      links: (item.links || []).map(l => ({ ...l })),
      transport: (item.transport || []).map(t => ({ ...t })),
      guide: {
        ...g,
        history: [...(g.history || [])],
        mustSee: [...(g.mustSee || [])],
        funFacts: [...(g.funFacts || [])],
        tips: [...(g.tips || [])],
      },
    }
    initialDraft.current = JSON.stringify(d)
    setDraft(d)
    setEditing(true)
  }

  function cancel() {
    const isDirty = draft && JSON.stringify(draft) !== initialDraft.current
    if (isDirty && !confirmCancel) {
      setConfirmCancel(true)
      return
    }
    setDraft(null)
    setEditing(false)
    setConfirmCancel(false)
    setShowItemAi(false)
  }

  async function save() {
    if (!onSave || !draft) return
    if (!draft.title?.trim()) {
      setValidationError('A program neve kötelező.')
      return
    }
    setValidationError(null)
    const guide = { ...(item.guide || {}), ...draft.guide }
    const result = await onSave({
      time: draft.time,
      title: draft.title,
      desc: draft.desc,
      highlight: draft.highlight || undefined,
      optional: draft.optional || undefined,
      badges: draft.badges.length ? draft.badges : undefined,
      links: draft.links,
      transport: draft.transport.length ? draft.transport : undefined,
      guide,
    })
    if (result?.ok !== false) {
      setDraft(null)
      setEditing(false)
    }
  }

  return {
    editing,
    draft,
    setDraft,
    confirmCancel,
    setConfirmCancel,
    showItemAi,
    toggleItemAi: () => setShowItemAi(s => !s),
    validationError,
    startEdit,
    cancel,
    save,
  }
}
