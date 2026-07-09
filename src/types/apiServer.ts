import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, TripsRow } from './supabase'
import type { Trip, TripImportData } from './trip'

export type { VercelRequest, VercelResponse }

export type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse | void> | VercelResponse | void
export type SupabaseAdmin = SupabaseClient<Database>

// --- Admin auth ---

export interface AdminRequestBody {
  password?: string
}

// --- Backup ---

export type SupabaseTripRow = TripsRow

export interface BackupFile {
  path: string
  content: string
  slug: string
}

export interface BackupManifestFile {
  path: string
  content: string
}

export interface BackupFilesResult {
  files: BackupFile[]
  manifest: BackupManifestFile
}

export interface GitHubConfig {
  token: string
  repo: string
  branch: string
  headers: Record<string, string>
}

export interface CommitResult {
  ok: boolean
  error?: string
  commitSha?: string | null
  commitUrl?: string | null
}

export interface BackupCommitEntry {
  path: string
  slug?: string
  commitSha: string | null
  commitUrl: string | null
}

export interface BackupFailedEntry {
  path: string
  slug?: string
  error: string
}

// --- Import ---

export interface TripBackupBody {
  application: 'Traveler'
  trip: {
    slug: string
    trip_data: TripImportData
    owner?: string | null
  }
}

export interface ImportSingleResult {
  ok: boolean
  slug?: string
  created?: boolean
  updated?: boolean
  error?: string
}

export interface ImportBatchResult {
  slug: string
  created?: boolean
  updated?: boolean
}

export interface ImportBatchError {
  index: number
  slug: string
  error: string
}

// --- Gemini ---

export interface GeminiModels {
  [key: string]: boolean | { label: string }
}

export interface GeminiCandidate {
  finishReason?: string
}

export interface GeminiResponse {
  text?: string
  candidates?: GeminiCandidate[]
}

export type ParsedRecord = Record<string, unknown>

export interface ChatMessage {
  role: string
  content: string
}

// --- Suggest section ---

export type SectionKey = 'packingList' | 'usefulLinks' | 'savingTips' | 'practicalInfo' | 'bookingChecklist' | 'day' | 'scheduleItemGuide' | 'scheduleItem'

export type ListSectionKey = 'packingList' | 'usefulLinks' | 'savingTips' | 'bookingChecklist' | 'practicalInfo'

export type DaySectionKey = 'day' | 'scheduleItemGuide' | 'scheduleItem'

export interface SectionExtra {
  dayNum?: number
  itemIndex?: number
}

export interface SectionConfig {
  buildPrompt: (trip: Trip, instruction: string | undefined, extra?: SectionExtra) => string
  system: string
  validate: (parsed: unknown) => string | null
  format: (parsed: unknown) => { suggestion: unknown; summary: string }
}

export interface SuggestRequestBody {
  section?: string
  trip?: unknown
  instruction?: string
  dayNum?: number
  itemIndex?: number
}

// --- Expand day ---

export interface ExpandDayItem {
  time?: string
  title: string
  type?: string
  note?: string
}

export interface ExpandDayCurrentDay {
  title?: string
  summary?: string
  items?: ExpandDayItem[]
}

export interface ExpandDayBody {
  tripTitle?: string
  destination?: string
  dayNumber?: number
  currentDay?: ExpandDayCurrentDay
  people?: string
  model?: string
  instruction?: string
}

// --- Plan trip ---

export interface PlanTripBody {
  messages?: ChatMessage[]
  detailLevel?: string
  model?: string
  instruction?: string
}

export interface DetailLevelConfig {
  maxItems: number
  maxTokens: number
  label: string
}

// --- Chat ---

export interface ChatBody {
  messages?: ChatMessage[]
  model?: string
}

// --- Import endpoint bodies ---

export interface ImportSingleBody {
  mode?: string
  backup?: unknown
  password?: string
}

export interface ImportBatchBody {
  mode?: string
  backups?: unknown[]
  password?: string
}
