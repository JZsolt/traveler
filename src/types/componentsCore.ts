import type { Alert, Cost, Day, Guide, Image, ScheduleItem, Ticket, TransportOptions, Trip } from './trip'
import type { DayScheduleAiReturn, OnSaveItemFn } from './hooks'

export interface AlertBoxProps {
  type: Alert['type']
  text: string
  url?: string
}

export interface CostTableProps {
  costs: Cost[]
  people: string
}

export interface GuideItemProps {
  item: string | { text: string; url?: string }
}

export interface GuideInfoProps {
  guide: Guide | undefined
}

export interface TransportOptionsProps {
  data: TransportOptions
  people: string
}

export interface ScheduleItemProps {
  item: ScheduleItem
  onSave?: OnSaveItemFn
  saving?: boolean
  error?: string | null
  isFirst?: boolean
  isLast?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  trip?: Trip
  dayNum?: number
  itemIndex?: number
  readOnly?: boolean
}

export interface DaySectionProps {
  day: Day
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
  isFirst?: boolean
  isLast?: boolean
}

export interface DayImagesProps {
  images: Image[] | undefined
  lightbox: Image | null
  onOpen: (image: Image) => void
  onClose: () => void
}

export interface DayTicketsProps {
  tickets: Ticket[] | undefined
}

export interface DayDeleteConfirmProps {
  dayNum: number
  saving: boolean
  onConfirm: () => void
  onCancel: () => void
}

export interface DayScheduleActionsProps {
  saving: boolean
  pending: boolean
  onAdd: () => void
  onAi: () => void
}

export interface DayScheduleAiPanelProps {
  scheduleAi: DayScheduleAiReturn
}
