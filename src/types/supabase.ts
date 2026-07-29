import type { Trip, TripImportData } from './trip'
import type { Profile } from './auth'

export type TripsRow = {
  id: string
  slug: string
  trip_data: unknown
  owner_id: string
  owner: string | null
  created_at: string
  updated_at: string
}

export type TripShareRow = {
  id: string
  trip_id: string
  token_hash: string
  created_by: string
  created_at: string
  expires_at: string | null
  revoked_at: string | null
}

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: TripsRow
        Insert: {
          slug: string
          trip_data: Trip | TripImportData
          owner_id: string
          owner?: string | null
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          trip_data?: Trip | TripImportData
          owner_id?: string
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
      trip_shares: {
        Row: TripShareRow
        Insert: {
          trip_id: string
          token_hash: string
          created_by: string
          id?: string
          created_at?: string
          expires_at?: string | null
          revoked_at?: string | null
        }
        Update: {
          token_hash?: string
          expires_at?: string | null
          revoked_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
