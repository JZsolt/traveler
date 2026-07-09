import type { RefObject } from 'react'
import type { CreateTripForm } from './createTrip'
import type { CreateTripChatReturn } from './hooks'
import type { DetailLevel } from './api'
import type { Trip } from './trip'

export type { EditTripForm } from './hooks'

export type CreateTripStep = 'form' | 'chat'

export interface EditTripFormPanelProps {
  trip: Trip
  slug: string
  refetch: () => Promise<void>
}


export interface CreateTripChatStepProps {
  form: CreateTripForm
  chat: CreateTripChatReturn
  chatEndRef: RefObject<HTMLDivElement | null>
  aiModel: string
  setAiModel: (value: string) => void
  detailLevel: DetailLevel
  setDetailLevel: (value: DetailLevel) => void
  generationPrompt: string
  setGenerationPrompt: (value: string) => void
  onBack: () => void
}
