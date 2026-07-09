import type { Trip, TripStatus } from '@/types/trip'

export function getTripStatus(trip: Trip): TripStatus {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const start = new Date(trip.startDate)
  const end = new Date(trip.endDate)

  if (now < start) {
    const days = Math.ceil((start.getTime() - now.getTime()) / 86400000)
    return { status: 'upcoming', label: `${days} nap mulva` }
  } else if (now >= start && now <= end) {
    return { status: 'current', label: 'Most!' }
  }
  return { status: 'past', label: 'Volt' }
}
