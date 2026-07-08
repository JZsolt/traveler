import type { Trip } from './trip'

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
          trip_data: Trip
          owner?: string | null
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          trip_data?: Trip
          owner?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
