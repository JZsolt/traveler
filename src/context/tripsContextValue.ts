import { createContext } from 'react'
import type { TripsContextValue } from '@/types/trips'

export const TripsContext = createContext<TripsContextValue>({
  trips: [],
  loading: true,
  error: null,
  refetch: async () => {},
})
