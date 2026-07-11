import type { Trip, TripImportData } from './trip'
import type { Profile } from './auth'

export type TripsRow = {
  id: string
  slug: string
  trip_data: unknown
  owner: string | null
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: TripsRow
        Insert: {
          slug: string
          trip_data: Trip | TripImportData
          owner?: string | null
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          trip_data?: Trip | TripImportData
          owner?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: Profile
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
