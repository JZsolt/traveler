import { useState, useRef } from 'react'
import { z } from 'zod'
import {
  AlertSchema, CostSchema, TicketSchema, ImageSchema, TransportOptionsSchema,
} from '@/schemas/trip'
import { formatZodError } from '@/schemas/errors'
import type { Day } from '@/types/trip'
import type {
  AdvancedFieldKey, AdvancedDraft, AdvancedErrors,
  DayAdvancedEditorProps, DayAdvancedEditorReturn,
} from '@/types/hooks'

const FIELD_SCHEMAS: Record<AdvancedFieldKey, z.ZodType> = {
  images: z.array(ImageSchema),
  tickets: z.array(TicketSchema),
  alerts: z.array(AlertSchema),
  transportOptions: TransportOptionsSchema,
  costs: z.array(CostSchema),
  endAlerts: z.array(AlertSchema),
}

const FIELDS: readonly AdvancedFieldKey[] = ['images', 'tickets', 'alerts', 'transportOptions', 'costs', 'endAlerts']

export function useDayAdvancedEditor({ day, saveTrip, updateTripDay }: DayAdvancedEditorProps): DayAdvancedEditorReturn {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<AdvancedDraft | null>(null)
  const [errors, setErrors] = useState<AdvancedErrors>({})
  const [confirmCancel, setConfirmCancel] = useState(false)
  const initialDraft = useRef<string | null>(null)

  function startEdit() {
    const stringify = (v: unknown) => v ? JSON.stringify(v, null, 2) : ''
    const d: AdvancedDraft = {
      images: stringify(day.images),
      tickets: stringify(day.tickets),
      alerts: stringify(day.alerts),
      transportOptions: stringify(day.transportOptions),
      costs: stringify(day.costs),
      endAlerts: stringify(day.endAlerts),
    }
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
    if (!draft) return
    const errs: AdvancedErrors = {}
    const values: Record<AdvancedFieldKey, unknown> = {
      images: undefined, tickets: undefined, alerts: undefined,
      transportOptions: undefined, costs: undefined, endAlerts: undefined,
    }
    for (const field of FIELDS) {
      const val = draft[field].trim()
      if (!val) continue
      let raw: unknown
      try { raw = JSON.parse(val) } catch { errs[field] = 'Ervenytelen JSON'; continue }
      const result = FIELD_SCHEMAS[field].safeParse(raw)
      if (!result.success) { errs[field] = formatZodError(result.error); continue }
      values[field] = result.data
    }
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    const parsed: Partial<Day> = Object.fromEntries(
      FIELDS.filter(f => values[f] !== undefined).map(f => [f, values[f]])
    )
    const result = await saveTrip(t => updateTripDay(t, day.dayNum, parsed))
    if (result.ok) { setDraft(null); setEditing(false) }
  }

  function updateField(field: AdvancedFieldKey, value: string) {
    setDraft(prev => prev ? { ...prev, [field]: value } : prev)
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
