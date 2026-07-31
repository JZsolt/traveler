import type { PublicTrip, ActiveShare, PendingInvite, SharedWithMeTrip } from './api'
import type { Trip } from './trip'
import type { LucideIcon } from 'lucide-react'

export type DashboardTab = 'owned' | 'shared' | 'invites'

export interface DashboardTabConfig {
  id: DashboardTab
  label: string
  icon: LucideIcon
}

export type SharedTripStatus = 'loading' | 'ok' | 'notfound' | 'error'

export interface SharedTripState {
  status: SharedTripStatus
  trip: PublicTrip | null
}

export interface SharedTripViewProps {
  trip: PublicTrip
}

export interface SharedWithMeTripPageState {
  status: 'loading' | 'ok' | 'notfound' | 'error'
  trip: PublicTrip | null
}

export interface SharedTripErrorProps {
  variant: 'notfound' | 'error'
}

export interface UseTripSharingParams {
  slug: string
}

export interface TripSharingReturn {
  loading: boolean
  busy: boolean
  error: string | null
  activeShare: ActiveShare | null
  isActive: boolean
  shareUrl: string | null
  refresh: () => Promise<void>
  createLink: () => Promise<void>
  disable: () => Promise<void>
  regenerate: () => Promise<void>
}

export interface ShareManagerProps {
  slug: string
  onClose: () => void
}

export interface ProfileQrInviteFormProps {
  slug: string
}

export interface UseProfileQrInviteParams {
  slug: string
}

export interface UseProfileQrInviteReturn {
  input: string
  busy: boolean
  message: string | null
  error: string | null
  setInput: (value: string) => void
  invite: () => Promise<void>
}

export interface ShareQrCodeProps {
  url: string
  label?: string
  downloadName?: string
}

export interface SharedWithMeState {
  loading: boolean
  error: string | null
  sharedTrips: SharedWithMeTrip[]
  pendingInvites: PendingInvite[]
  unavailableCount: number
  busyInviteId: string | null
  refresh: () => Promise<void>
  acceptInvite: (inviteId: string) => Promise<void>
  declineInvite: (inviteId: string) => Promise<void>
}

export interface DashboardTabsProps {
  active: DashboardTab
  ownedCount: number
  sharedCount: number
  inviteCount: number
  onChange: (tab: DashboardTab) => void
}

export interface OwnedTripsSectionProps {
  trips: Trip[]
  sharedSlugs: Set<string>
}

export interface SharedTripsSectionProps {
  trips: SharedWithMeTrip[]
  loading: boolean
  error: string | null
  unavailableCount: number
  onRetry: () => Promise<void>
}

export interface PendingInvitesSectionProps {
  invites: PendingInvite[]
  loading: boolean
  error: string | null
  unavailableCount: number
  busyInviteId: string | null
  onAccept: (inviteId: string) => Promise<void>
  onDecline: (inviteId: string) => Promise<void>
  onRetry: () => Promise<void>
}

export interface OwnedTripCardProps {
  trip: Trip
  isShared: boolean
}

export interface SharedTripCardProps {
  item: SharedWithMeTrip
}

export interface PendingInviteCardProps {
  invite: PendingInvite
  busy: boolean
  onAccept: (inviteId: string) => Promise<void>
  onDecline: (inviteId: string) => Promise<void>
}
