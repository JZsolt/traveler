import type { RefObject } from 'react'
import type { Trip } from './trip'
import type { ImportBackupMode, ImportBackupState, ImportBackupResult } from './componentsAdmin'
import type { DetailLevel, ChatMessage } from './api'
import type { CreateTripForm, Draft } from './createTrip'

export type { SaveTripFn, UpdateTripDayFn } from './hooksEditor'
export type {
  DayMetaDraft, DayMetaEditorProps, DayMetaEditorReturn,
  AdvancedFieldKey, AdvancedDraft, AdvancedErrors,
  DayAdvancedEditorProps, DayAdvancedEditorReturn,
  ScheduleAiPreview, DayScheduleAiProps, DayScheduleAiReturn,
  ScheduleItemDraft, OnSaveItemFn, ScheduleItemEditorProps, ScheduleItemEditorReturn,
} from './hooksEditor'

// --- Trip workflow hooks ---

export interface TripUpdaterProps {
  trip: Trip | null | undefined
  slug: string | undefined
  refetch: () => Promise<void> | void
}

export interface TripUpdaterReturn {
  saveTrip: (updater: ((trip: Trip) => Trip) | Partial<Trip>) => Promise<{ ok: boolean; error?: string }>
  saving: boolean
  error: string | null
}

export interface DeleteTripProps {
  slug: string | undefined
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
  trip: Trip | null | undefined
  slug: string | undefined
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

// --- Edit trip hook ---

export interface EditTripProps {
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
  navigate: (path: string) => void
}

export interface EditTripForm {
  title: string
  startDate: string
  endDate: string
  emoji: string
  people: string
}

export interface EditTripReturn {
  form: EditTripForm
  update: (field: keyof EditTripForm, value: string) => void
  saving: boolean
  error: string | null
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

// --- Import trip JSON hook ---

export interface ImportTripJsonProps {
  refetch: () => Promise<void> | void
  navigate: (path: string) => void
}

export interface ImportTripJsonReturn {
  importing: boolean
  error: string | null
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// --- Admin unlock hook ---

export interface AdminUnlockProps {
  unlockAdmin: (password: string) => Promise<{ ok: boolean; error?: string }>
}

export interface AdminUnlockReturn {
  password: string
  setPassword: (value: string) => void
  loading: boolean
  error: string | null
  handleUnlock: (e: React.FormEvent) => Promise<void>
}

// --- Import backup hook ---

export interface ImportBackupProps {
  refetch: () => Promise<void> | void
  fileRef: React.RefObject<HTMLInputElement | null>
}

export interface ImportBackupReturn {
  mode: ImportBackupMode
  setMode: (mode: ImportBackupMode) => void
  state: ImportBackupState
  result: ImportBackupResult | null
  error: string | null
  password: string
  setPassword: (value: string) => void
  handleImport: () => Promise<void>
}
