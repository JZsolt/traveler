import type { ReactNode } from 'react'
import type { Trip } from './trip'
import type { ScheduleItemDraft } from './hooks'

export interface EditableSectionProps {
  title?: string
  children?: ReactNode
  editor?: ReactNode
  onSave?: () => Promise<{ ok: boolean; error?: string } | undefined>
  onCancel?: () => void
  saving?: boolean
  error?: string | null
  canUseAi?: boolean
  onAi?: () => void
  isDirty?: boolean
}

export interface AiSuggestionPanelProps<T = unknown> {
  section: string
  trip: Trip
  onApply: (suggestion: T) => void
  renderPreview: (suggestion: T) => ReactNode
  validateSuggestion: (value: unknown) => value is T
  applyLabel?: string
  extraBody?: Record<string, unknown>
}

export interface DirtyCancelRowProps {
  show: boolean
  onDiscard: () => void
  onDismiss: () => void
  dark?: boolean
}

export interface ArrayEditorProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  placeholder: T | (() => T)
  renderItem: (item: T, update: (value: T) => void) => ReactNode
}

export interface ScheduleEditorProps {
  draft: ScheduleItemDraft
  onChange: (draft: ScheduleItemDraft) => void
  aiGuidePanel?: ReactNode
}
