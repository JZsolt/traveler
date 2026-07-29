import type { Trip, Day } from './trip'
import type { z } from 'zod'
import type {
  CreateTripShareRequestSchema,
  CreateTripShareResponseSchema,
  PublicTripSchema,
  PublicDaySchema,
  SharedTripRequestSchema,
  PublicSharedTripResponseSchema,
  ActiveShareSchema,
} from '../schemas/sharing'

// --- AI suggestion endpoint ---

export type SuggestionSection =
  | 'packingList'
  | 'usefulLinks'
  | 'savingTips'
  | 'practicalInfo'
  | 'bookingChecklist'
  | 'day'
  | 'scheduleItemGuide'
  | 'scheduleItem'

export interface SuggestSectionRequest {
  section: SuggestionSection
  trip: Trip
  instruction?: string
  dayNum?: number
  itemIndex?: number
}

export interface SuggestSectionResponse {
  suggestion: unknown
  summary: string
}

export interface SuggestSectionError {
  error: string
  code: string
  retryable: boolean
}

// --- Expand day endpoint ---

export interface ExpandDayCurrentDay {
  title: string
  summary?: string
  items?: { time?: string; title: string; type?: string; note?: string }[]
}

export interface ExpandDayRequest {
  tripTitle: string
  destination?: string
  dayNumber: number
  currentDay: ExpandDayCurrentDay
  people?: string
  model?: string
  instruction?: string
}

export interface ExpandDayResponse {
  day: Day
}

// --- Plan trip endpoint ---

export type DetailLevel = 'quick' | 'normal' | 'detailed'

export interface PlanTripRequest {
  messages: ChatMessage[]
  detailLevel?: DetailLevel
  model?: string
  instruction?: string
}

export interface PlanTripResponse {
  trip: Trip
}

// --- Chat endpoint ---

export interface ChatRequest {
  messages: ChatMessage[]
  model?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// --- Import/export ---

export interface TripBackup {
  application: 'Traveler'
  exportedAt?: string
  version?: number
  trip: {
    slug: string
    trip_data: Trip
    owner?: string | null
  }
}

export type ImportMode = 'create' | 'upsert-by-slug'

export interface ImportSingleRequest {
  mode: ImportMode
  backup: TripBackup
}

export interface ImportBatchRequest {
  mode: ImportMode
  backups: TripBackup[]
}

export interface ImportResult {
  ok: boolean
  slug?: string
  error?: { code: string; message: string }
}

// --- Sharing ---

export type CreateTripShareRequest = z.infer<typeof CreateTripShareRequestSchema>
export type CreateTripShareResponse = z.infer<typeof CreateTripShareResponseSchema>
export type PublicTrip = z.infer<typeof PublicTripSchema>
export type PublicDay = z.infer<typeof PublicDaySchema>
export type SharedTripRequest = z.infer<typeof SharedTripRequestSchema>
export type PublicSharedTripResponse = z.infer<typeof PublicSharedTripResponseSchema>
export type ActiveShare = z.infer<typeof ActiveShareSchema>

// --- Admin ---

export interface AdminLoginRequest {
  password: string
}

export interface AdminLoginResponse {
  ok: boolean
  token?: string
}

// --- Generic API error ---

export interface ApiError {
  ok: false
  error: { code: string; message: string }
}

// --- Trip JSON validation ---

export interface ValidationSuccess {
  valid: true
  errors: []
  normalizedTrip: Trip
}

export interface ValidationFailure {
  valid: false
  errors: string[]
  normalizedTrip: null
}

export type ValidationResult = ValidationSuccess | ValidationFailure
