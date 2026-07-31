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
  token_ciphertext: string | null
  token_key_version: number
  created_by: string
  created_at: string
  expires_at: string | null
  revoked_at: string | null
}

export type TripShareRecipientRow = {
  id: string
  trip_id: string
  share_id: string | null
  owner_id: string
  recipient_user_id: string
  recipient_email: string | null
  created_at: string
  accepted_at: string | null
  declined_at: string | null
  revoked_at: string | null
}

export type TripInviteEmailEventRow = {
  id: string
  owner_id: string
  trip_id: string
  recipient_email: string
  status: string
  created_at: string
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
          public_share_id?: string | null
          profile_share_enabled?: boolean
          profile_share_rotated_at?: string | null
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          public_share_id?: string | null
          profile_share_enabled?: boolean
          profile_share_rotated_at?: string | null
        }
        Relationships: []
      }
      trip_shares: {
        Row: TripShareRow
        Insert: {
          trip_id: string
          token_hash: string
          created_by: string
          token_ciphertext?: string | null
          token_key_version?: number
          id?: string
          created_at?: string
          expires_at?: string | null
          revoked_at?: string | null
        }
        Update: {
          token_hash?: string
          token_ciphertext?: string | null
          token_key_version?: number
          expires_at?: string | null
          revoked_at?: string | null
        }
        Relationships: []
      }
      trip_share_recipients: {
        Row: TripShareRecipientRow
        Insert: {
          trip_id: string
          owner_id: string
          recipient_user_id: string
          share_id?: string | null
          recipient_email?: string | null
          id?: string
          created_at?: string
          accepted_at?: string | null
          declined_at?: string | null
          revoked_at?: string | null
        }
        Update: {
          share_id?: string | null
          recipient_email?: string | null
          accepted_at?: string | null
          declined_at?: string | null
          revoked_at?: string | null
        }
        Relationships: []
      }
      trip_invite_email_events: {
        Row: TripInviteEmailEventRow
        Insert: {
          owner_id: string
          trip_id: string
          recipient_email: string
          status: string
          id?: string
          created_at?: string
        }
        Update: {
          status?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      resolve_user_id_by_email: {
        Args: { p_email: string }
        Returns: string | null
      }
    }
  }
}
