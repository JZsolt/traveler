import { z } from 'zod'
import {
  TripSchema, DaySchema, AlertSchema, CostSchema, TicketSchema, ImageSchema,
  TransportOptionsSchema, UsefulLinkSchema, SavingTipSchema, PracticalInfoSectionSchema,
  BookingChecklistItemSchema, OverviewDaySchema, InsuranceSchema,
} from '@/schemas/trip'
import type {
  Trip, Accommodation, AccommodationTextField, Flight, Budget,
  UrgentBooking, Link, TransportLink, Guide, ScheduleItem, Day,
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

function filterValid<T>(schema: z.ZodType<T>, data: unknown): T[] {
  return arr(data)
    .map(v => schema.safeParse(v))
    .filter((r): r is z.ZodSafeParseSuccess<T> => r.success)
    .map(r => r.data)
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

function normalizeDay(v: unknown): Day | null {
  const fast = DaySchema.safeParse(v)
  if (fast.success) return fast.data

  const o = rec(v)
  if (typeof o.dayNum !== 'number' || typeof o.title !== 'string') return null
  if (!Array.isArray(o.schedule)) return null

  const day: Day = {
    dayNum: o.dayNum,
    title: o.title,
    schedule: o.schedule
      .map(normalizeScheduleItem)
      .filter((item): item is ScheduleItem => item !== null),
  }
  if (typeof o.subtitle === 'string') day.subtitle = o.subtitle
  if (typeof o._draft === 'boolean') day._draft = o._draft

  const alerts = filterValid(AlertSchema, o.alerts)
  if (alerts.length > 0) day.alerts = alerts
  const endAlerts = filterValid(AlertSchema, o.endAlerts)
  if (endAlerts.length > 0) day.endAlerts = endAlerts
  const tickets = filterValid(TicketSchema, o.tickets)
  if (tickets.length > 0) day.tickets = tickets
  const images = filterValid(ImageSchema, o.images)
  if (images.length > 0) day.images = images
  const costs = filterValid(CostSchema, o.costs)
  if (costs.length > 0) day.costs = costs

  const tp = TransportOptionsSchema.safeParse(o.transportOptions)
  if (tp.success) day.transportOptions = tp.data

  return day
}

function normalizeAccommodation(raw: unknown): Accommodation {
  const o = rec(raw)
  const result: Accommodation = {
    address: str(o.address),
    mapUrl: str(o.mapUrl),
  }
  const optionalTextFields: AccommodationTextField[] = ['host', 'gateCode', 'doorCode', 'reservationCode', 'checkIn', 'checkOut', 'accessNote', 'parking', 'contactEmail', 'contactPhone']
  for (const key of optionalTextFields) {
    if (typeof o[key] === 'string') result[key] = o[key]
  }
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
  return { airport: str(o.airport), arrival: str(o.arrival), departure: str(o.departure) }
}

function normalizeBudget(raw: unknown): Budget {
  const o = rec(raw)
  const result: Budget = { headline: str(o.headline) }
  const optionals: (keyof Budget)[] = ['lowPerFamily', 'comfortPerFamily', 'lowTotal', 'comfortTotal', 'lowPerFamilyLabel', 'comfortPerFamilyLabel', 'lowTotalLabel', 'comfortTotalLabel', 'summaryLabel']
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
  const fast = TripSchema.safeParse(raw)
  if (fast.success) return fast.data

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...DEFAULTS }
  const s = rec(raw)

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
    usefulLinks: filterValid(UsefulLinkSchema, s.usefulLinks),
    packingList: arr(s.packingList).filter((v): v is string => typeof v === 'string'),
    savingTips: filterValid(SavingTipSchema, s.savingTips),
    practicalInfo: filterValid(PracticalInfoSectionSchema, s.practicalInfo),
    bookingChecklist: filterValid(BookingChecklistItemSchema, s.bookingChecklist),
    overview: filterValid(OverviewDaySchema, s.overview),
    days: arr(s.days)
      .map(normalizeDay)
      .filter((day): day is Day => day !== null),
  }

  if (typeof s.destination === 'string') trip.destination = s.destination
  if (typeof s.savingTipsLabel === 'string') trip.savingTipsLabel = s.savingTipsLabel
  if (typeof s.status === 'string') trip.status = s.status
  if (typeof s.aiModel === 'string') trip.aiModel = s.aiModel

  const ins = InsuranceSchema.safeParse(s.insurance)
  if (ins.success) trip.insurance = ins.data

  if (Array.isArray(s.expandedDays)) {
    trip.expandedDays = s.expandedDays.filter((v): v is number => typeof v === 'number')
  }

  const recheck = TripSchema.safeParse(trip)
  if (recheck.success) return recheck.data

  console.warn('[normalizeTrip] Normalized trip failed final validation, returning defaults')
  return { ...DEFAULTS }
}
