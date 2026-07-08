import type { RefObject } from 'react'
import type { Trip, Day, ScheduleItem, Cost, Link, TransportLink, Guide } from './trip'
import type { DetailLevel, ChatMessage } from './api'
import type { CreateTripForm, Draft } from './createTrip'

export type SaveTripFn = (updater: ((trip: Trip) => Trip) | Partial<Trip>) => Promise<{ ok: boolean; error?: string }>
export type UpdateTripDayFn = (trip: Trip, dayNum: number, update: Partial<Day>) => Trip

export interface TripUpdaterProps {
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface TripUpdaterReturn {
  saveTrip: (updater: ((trip: Trip) => Trip) | Partial<Trip>) => Promise<{ ok: boolean; error?: string }>
  saving: boolean
  error: string | null
}

export interface DeleteTripProps {
  slug: string
  refetch: () => Promise<void> | void
}

export interface DeleteTripReturn {
  showModal: boolean
  openModal: () => void
  closeModal: () => void
  confirmDelete: () => Promise<void>
  deleting: boolean
  error: string | null
}

export interface ExpandDayProps {
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface ExpandDayReturn {
  expandingDay: number | null
  expandError: string | null
  expandPrompts: Record<number, string>
  expandModels: Record<number, string>
  expandedDays: number[]
  setExpandPrompt: (dayNum: number, value: string) => void
  setExpandModel: (dayNum: number, value: string) => void
  expandDay: (dayNum: number) => Promise<void>
}

export interface CreateTripChatProps {
  form: CreateTripForm
  aiModel: string
  refetch: () => Promise<void> | void
  chatEndRef: RefObject<HTMLDivElement | null>
}

export interface CreateTripChatReturn {
  messages: ChatMessage[]
  chatInput: string
  setChatInput: (value: string) => void
  chatLoading: boolean
  generating: boolean
  generatedTrip: Draft | null
  aiError: string | null
  is429: boolean
  saving: boolean
  startChat: (initialMessages: ChatMessage[]) => void
  sendMessage: () => Promise<void>
  generate: (detailLevel: DetailLevel, instruction?: string) => Promise<void>
  saveTrip: () => Promise<void>
  reset: () => void
}

// --- Day/Schedule editor hooks ---

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
