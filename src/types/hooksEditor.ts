import type { Trip, Day, ScheduleItem, Cost, Link, TransportLink, Guide } from './trip'

export type SaveTripFn = (updater: ((trip: Trip) => Trip) | Partial<Trip>) => Promise<{ ok: boolean; error?: string }>
export type UpdateTripDayFn = (trip: Trip, dayNum: number, update: Partial<Day>) => Trip

export interface DayMetaDraft {
  title: string
  subtitle: string
}

export interface DayMetaEditorProps {
  day: Day
  saveTrip: SaveTripFn
  updateTripDay: UpdateTripDayFn
}

export interface DayMetaEditorReturn {
  editing: boolean
  draft: DayMetaDraft | null
  setDraft: (value: DayMetaDraft | null) => void
  confirmCancel: boolean
  setConfirmCancel: (value: boolean) => void
  showAi: boolean
  toggleAi: () => void
  startEdit: (e?: React.MouseEvent) => void
  cancel: (e?: React.MouseEvent) => void
  save: (e?: React.MouseEvent) => Promise<{ ok: boolean; error?: string } | undefined>
}

export type AdvancedFieldKey = 'images' | 'tickets' | 'alerts' | 'transportOptions' | 'costs' | 'endAlerts'

export type AdvancedDraft = Record<AdvancedFieldKey, string>
export type AdvancedErrors = Partial<Record<AdvancedFieldKey, string>>

export interface DayAdvancedEditorProps {
  day: Day
  saveTrip: SaveTripFn
  updateTripDay: UpdateTripDayFn
}

export interface DayAdvancedEditorReturn {
  editing: boolean
  draft: AdvancedDraft | null
  errors: AdvancedErrors
  confirmCancel: boolean
  fields: readonly AdvancedFieldKey[]
  startEdit: () => void
  cancel: () => void
  dismissCancel: () => void
  save: () => Promise<void>
  updateField: (field: AdvancedFieldKey, value: string) => void
}

export interface ScheduleAiPreview {
  title?: string
  subtitle?: string
  schedule?: ScheduleItem[]
  costs?: Cost[]
}

export interface DayScheduleAiProps {
  day: Day
  trip: Trip
  saveTrip: SaveTripFn
  updateTripDay: UpdateTripDayFn
}

export interface DayScheduleAiReturn {
  showPanel: boolean
  togglePanel: () => void
  instruction: string
  setInstruction: (value: string) => void
  loading: boolean
  error: string | null
  preview: ScheduleAiPreview | null
  clearPreview: () => void
  pendingDraft: Partial<Day> | null
  generate: () => Promise<void>
  applyPreview: () => void
  saveDraft: () => Promise<void>
  discardDraft: () => void
}

export interface ScheduleItemDraft {
  time: string
  title: string
  desc: string
  highlight: boolean
  optional: boolean
  badges: string[]
  links: Link[]
  transport: TransportLink[]
  guide: Required<Pick<Guide, 'history' | 'mustSee' | 'funFacts' | 'tips'>> & Guide
}

export type OnSaveItemFn = (item: Partial<ScheduleItem>) => Promise<{ ok: boolean; error?: string } | undefined>

export interface ScheduleItemEditorProps {
  item: ScheduleItem
  onSave?: OnSaveItemFn
}

export interface ScheduleItemEditorReturn {
  editing: boolean
  draft: ScheduleItemDraft | null
  setDraft: React.Dispatch<React.SetStateAction<ScheduleItemDraft | null>>
  confirmCancel: boolean
  setConfirmCancel: (value: boolean) => void
  showItemAi: boolean
  toggleItemAi: () => void
  validationError: string | null
  startEdit: () => void
  cancel: () => void
  save: () => Promise<void>
}
