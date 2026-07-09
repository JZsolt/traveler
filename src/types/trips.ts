import type { ReactNode } from 'react'
import type { Trip } from './trip'

export interface TripsError {
  message: string
  raw: unknown
}

export interface TripsContextValue {
  trips: Trip[]
  loading: boolean
  error: TripsError | null
  refetch: () => Promise<void>
}

export interface TripsProviderProps {
  children: ReactNode
}
