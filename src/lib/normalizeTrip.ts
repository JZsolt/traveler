import type {
  Trip, Accommodation, Flight, Budget,
  UrgentBooking, UsefulLink, SavingTip, PracticalInfoSection,
  BookingChecklistItem, OverviewDay, Day, Insurance, Link,
  TransportLink, Guide, ScheduleItem,
} from '@/types/trip'

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function rec(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function normalizeLink(v: unknown): Link | null {
  const o = rec(v)
  if (typeof o.label !== 'string' || typeof o.url !== 'string') return null
  return { label: o.label, url: o.url }
}

function normalizeUrgentBooking(v: unknown): UrgentBooking | null {
  const o = rec(v)
  if (typeof o.name !== 'string' || typeof o.reason !== 'string') return null

  const booking: UrgentBooking = {
    name: o.name,
    reason: o.reason,
    done: o.done === true,
  }
  if (typeof o.url === 'string') booking.url = o.url
  const urls = arr(o.urls).map(normalizeLink).filter((link): link is Link => link !== null)
  if (urls.length > 0) booking.urls = urls
  return booking
}

function isUsefulLink(v: unknown): v is UsefulLink {
  const o = rec(v)
  return typeof o.emoji === 'string' && typeof o.name === 'string'
    && typeof o.desc === 'string' && typeof o.url === 'string'
}

function isSavingTip(v: unknown): v is SavingTip {
  const o = rec(v)
  return typeof o.tip === 'string' && typeof o.saving === 'string'
}

function isPracticalInfo(v: unknown): v is PracticalInfoSection {
  const o = rec(v)
  return typeof o.title === 'string' && Array.isArray(o.items)
    && o.items.every((i: unknown) => typeof i === 'string')
}

function isChecklistItem(v: unknown): v is BookingChecklistItem {
  const o = rec(v)
  return typeof o.item === 'string'
}

function isOverviewDay(v: unknown): v is OverviewDay {
  const o = rec(v)
  return typeof o.day === 'number' && typeof o.date === 'string'
    && typeof o.program === 'string' && typeof o.highlights === 'string'
}

function normalizeTransportLink(v: unknown): TransportLink | null {
  const o = rec(v)
  if (typeof o.type !== 'string' || typeof o.label !== 'string' || typeof o.url !== 'string') return null
  return { type: o.type, label: o.label, url: o.url }
}

function normalizeGuide(v: unknown): Guide {
  const o = rec(v)
  const guide: Guide = {}

  for (const [key, value] of Object.entries(o)) {
    if (!['history', 'mustSee', 'funFacts', 'tips'].includes(key)) guide[key] = value
  }

  for (const key of ['history', 'mustSee', 'funFacts', 'tips'] as const) {
    if (Array.isArray(o[key])) {
      guide[key] = o[key].filter((item): item is string => typeof item === 'string')
    }
  }
  return guide
}

function normalizeScheduleItem(v: unknown): ScheduleItem | null {
  const o = rec(v)
  if (typeof o.title !== 'string') return null

  const item: ScheduleItem = {
    time: str(o.time),
    title: o.title,
  }
  if (typeof o.desc === 'string') item.desc = o.desc
  if (typeof o.highlight === 'boolean') item.highlight = o.highlight
  if (typeof o.optional === 'boolean') item.optional = o.optional

  const badges = arr(o.badges).filter((badge): badge is string => typeof badge === 'string')
  if (badges.length > 0) item.badges = badges

  const links = arr(o.links).map(normalizeLink).filter((link): link is Link => link !== null)
  if (links.length > 0) item.links = links

  const transport = arr(o.transport)
    .map(normalizeTransportLink)
    .filter((link): link is TransportLink => link !== null)
  if (transport.length > 0) item.transport = transport

  if (o.guide !== undefined) item.guide = normalizeGuide(o.guide)
  return item
}

function isDay(v: unknown): v is Day {
  const o = rec(v)
  return typeof o.dayNum === 'number' && typeof o.title === 'string'
    && Array.isArray(o.schedule)
}

function isInsurance(v: unknown): v is Insurance {
  const o = rec(v)
  return typeof o.pdf === 'string' && typeof o.label === 'string'
    && typeof o.desc === 'string'
}

function normalizeAccommodation(raw: unknown): Accommodation {
  const o = rec(raw)
  const result: Accommodation = {
    address: str(o.address),
    mapUrl: str(o.mapUrl),
  }
  if (typeof o.host === 'string') result.host = o.host
  if (typeof o.gateCode === 'string') result.gateCode = o.gateCode
  if (typeof o.doorCode === 'string') result.doorCode = o.doorCode
  const w = rec(o.wifi)
  if (typeof w.name === 'string' && typeof w.password === 'string') {
    result.wifi = { name: w.name, password: w.password }
  }
  if (Array.isArray(o.videos)) {
    result.videos = o.videos
      .filter((v): v is Record<string, unknown> => typeof rec(v).url === 'string')
      .map(v => ({ url: str(rec(v).url), label: str(rec(v).label) }))
  }
  return result
}

function normalizeFlight(raw: unknown): Flight {
  const o = rec(raw)
  return {
    airport: str(o.airport),
    arrival: str(o.arrival),
    departure: str(o.departure),
  }
}

function normalizeBudget(raw: unknown): Budget {
  const o = rec(raw)
  const result: Budget = { headline: str(o.headline) }
  const optionals: (keyof Budget)[] = [
    'lowPerFamily', 'comfortPerFamily', 'lowTotal', 'comfortTotal',
    'lowPerFamilyLabel', 'comfortPerFamilyLabel', 'lowTotalLabel', 'comfortTotalLabel',
    'summaryLabel',
  ]
  for (const key of optionals) {
    if (typeof o[key] === 'string') result[key] = o[key] as string
  }
  return result
}

const DEFAULTS: Trip = {
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

export function normalizeTrip(raw: unknown): Trip {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...DEFAULTS }
  const s = raw as Record<string, unknown>

  const trip: Trip = {
    slug: str(s.slug),
    title: str(s.title),
    subtitle: str(s.subtitle),
    startDate: str(s.startDate),
    endDate: str(s.endDate),
    emoji: str(s.emoji, '🧳'),
    people: str(s.people),
    highlights: arr(s.highlights).filter((v): v is string => typeof v === 'string'),
    accommodation: normalizeAccommodation(s.accommodation),
    flight: normalizeFlight(s.flight),
    budget: normalizeBudget(s.budget),
    urgentBookings: arr(s.urgentBookings)
      .map(normalizeUrgentBooking)
      .filter((booking): booking is UrgentBooking => booking !== null),
    usefulLinks: arr(s.usefulLinks).filter(isUsefulLink),
    packingList: arr(s.packingList).filter((v): v is string => typeof v === 'string'),
    savingTips: arr(s.savingTips).filter(isSavingTip),
    practicalInfo: arr(s.practicalInfo).filter(isPracticalInfo),
    bookingChecklist: arr(s.bookingChecklist).filter(isChecklistItem),
    overview: arr(s.overview).filter(isOverviewDay),
    days: arr(s.days)
      .filter(isDay)
      .map(day => ({
        ...day,
        schedule: arr(day.schedule)
          .map(normalizeScheduleItem)
          .filter((item): item is ScheduleItem => item !== null),
      })),
  }

  if (typeof s.destination === 'string') trip.destination = s.destination
  if (typeof s.savingTipsLabel === 'string') trip.savingTipsLabel = s.savingTipsLabel
  if (typeof s.status === 'string') trip.status = s.status
  if (typeof s.aiModel === 'string') trip.aiModel = s.aiModel
  if (isInsurance(s.insurance)) trip.insurance = s.insurance
  if (Array.isArray(s.expandedDays)) {
    trip.expandedDays = s.expandedDays.filter((v): v is number => typeof v === 'number')
  }

  return trip
}
