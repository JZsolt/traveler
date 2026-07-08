import type { Trip } from '@/types/trip'

export function sortTrips(trips: Trip[]): Trip[] {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcoming: Trip[] = []
  const past: Trip[] = []

  for (const trip of trips) {
    const start = trip.startDate ? new Date(trip.startDate) : null
    if (!start || isNaN(start.getTime())) {
      past.push(trip)
      continue
    }
    if (start >= now) {
      upcoming.push(trip)
    } else {
      past.push(trip)
    }
  }

  upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  past.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  return [...upcoming, ...past]
}
