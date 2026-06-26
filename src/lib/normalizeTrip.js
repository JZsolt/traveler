const DEFAULTS = {
  slug: '',
  title: '',
  subtitle: '',
  startDate: '',
  endDate: '',
  emoji: '🧳',
  people: '',
  highlights: [],
  days: [],
  overview: [],
  accommodation: { address: '', mapUrl: '' },
  flight: { airport: '', arrival: '', departure: '' },
  budget: { headline: '' },
  urgentBookings: [],
  usefulLinks: [],
  packingList: [],
  savingTips: [],
  practicalInfo: [],
  bookingChecklist: [],
}

export function normalizeTrip(raw) {
  if (!raw) return { ...DEFAULTS }
  const trip = { ...DEFAULTS, ...raw }
  if (!Array.isArray(trip.highlights)) trip.highlights = []
  if (!Array.isArray(trip.days)) trip.days = []
  if (!Array.isArray(trip.overview)) trip.overview = []
  return trip
}
