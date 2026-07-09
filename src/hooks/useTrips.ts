import { useContext } from 'react'
import { TripsContext } from '@/context/tripsContextValue'
import type { TripsContextValue } from '@/types/trips'

export function useTrips(): TripsContextValue {
  return useContext(TripsContext)
}
