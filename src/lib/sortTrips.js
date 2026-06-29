export function sortTrips(trips) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcoming = []
  const past = []

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

  upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  past.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  return [...upcoming, ...past]
}
