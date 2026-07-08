export interface Link {
  label: string
  url: string
}

export interface TransportLink {
  type: string
  label: string
  url: string
}

export interface Guide {
  history?: string[]
  mustSee?: string[]
  funFacts?: string[]
  tips?: string[]
  [key: string]: unknown
}

export interface ScheduleItem {
  time: string
  title: string
  desc?: string
  highlight?: boolean
  optional?: boolean
  badges?: string[]
  links?: Link[]
  transport?: TransportLink[]
  guide?: Guide
}

export interface Alert {
  type: 'tip' | 'warning' | 'urgent'
  text: string
  url?: string
}

export interface Cost {
  item: string
  cost: string
  total?: boolean
}

export interface Ticket {
  label: string
  desc: string
  pdf?: string
}

export interface Image {
  url: string
  caption?: string
}

export interface TransportOption {
  name: string
  time?: string
  pricePerPerson?: string
  total?: string
  url?: string
  recommended?: boolean
}

export interface TransportOptions {
  title: string
  options: TransportOption[]
}

export interface Day {
  dayNum: number
  title: string
  subtitle?: string
  _draft?: boolean
  alerts?: Alert[]
  endAlerts?: Alert[]
  tickets?: Ticket[]
  images?: Image[]
  transportOptions?: TransportOptions
  schedule: ScheduleItem[]
  costs?: Cost[]
}

export interface Wifi {
  name: string
  password: string
}

export interface AccommodationVideo {
  url: string
  label: string
}

export interface Accommodation {
  address?: string
  mapUrl?: string
  host?: string
  gateCode?: string
  doorCode?: string
  wifi?: Wifi
  videos?: AccommodationVideo[]
  [key: string]: unknown
}

export interface Flight {
  airport?: string
  arrival?: string
  departure?: string
}

export interface Budget {
  headline?: string
  lowPerFamily?: string
  comfortPerFamily?: string
  lowTotal?: string
  comfortTotal?: string
  lowPerFamilyLabel?: string
  comfortPerFamilyLabel?: string
  lowTotalLabel?: string
  comfortTotalLabel?: string
  summaryLabel?: string
}

export interface UrgentBooking {
  name: string
  reason: string
  url: string
  done: boolean
}

export interface UsefulLink {
  emoji: string
  name: string
  desc: string
  url: string
}

export interface SavingTip {
  tip: string
  saving: string
}

export interface PracticalInfoSection {
  title: string
  items: string[]
}

export interface BookingChecklistItem {
  item: string
  url?: string
  done?: boolean
}

export interface Insurance {
  pdf: string
  label: string
  desc: string
}

export interface OverviewDay {
  day: number
  date: string
  program: string
  highlights: string
}

export interface Trip {
  slug: string
  title: string
  subtitle: string
  emoji: string
  startDate: string
  endDate: string
  people: string
  destination?: string
  highlights: string[]
  accommodation: Accommodation
  flight: Flight
  budget: Budget
  urgentBookings: UrgentBooking[]
  usefulLinks: UsefulLink[]
  packingList: string[]
  savingTips: SavingTip[]
  practicalInfo: PracticalInfoSection[]
  bookingChecklist: BookingChecklistItem[]
  insurance?: Insurance
  overview: OverviewDay[]
  days: Day[]
  status?: string
  aiModel?: string
  expandedDays?: number[]
}

export interface TripRowRaw {
  id?: string
  slug: string
  trip_data: unknown
  owner?: string | null
}

export interface TripRow {
  id?: string
  slug: string
  trip_data: Trip
  owner?: string | null
}
