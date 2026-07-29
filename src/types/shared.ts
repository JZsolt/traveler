import type { PublicTrip, ActiveShare } from './api'

export type SharedTripStatus = 'loading' | 'ok' | 'notfound' | 'error'

export interface SharedTripState {
  status: SharedTripStatus
  trip: PublicTrip | null
}

export interface SharedTripViewProps {
  trip: PublicTrip
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

