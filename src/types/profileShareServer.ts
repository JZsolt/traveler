export interface ProfileShareRowFields {
  public_share_id: string | null
  profile_share_enabled: boolean | null
  profile_share_rotated_at: string | null
}

export interface ProfileShareUpdatePatch {
  public_share_id?: string | null
  profile_share_enabled?: boolean
  profile_share_rotated_at?: string | null
}
