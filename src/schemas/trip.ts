import { z } from 'zod'

export const LinkSchema = z.object({
  label: z.string(),
  url: z.string(),
})

export const TransportLinkSchema = z.object({
  type: z.string(),
  label: z.string(),
  url: z.string(),
})

// passthrough: Guide stores extra keys from AI responses
export const GuideSchema = z.object({
  history: z.array(z.string()).optional(),
  mustSee: z.array(z.string()).optional(),
  funFacts: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
}).passthrough()

export const ScheduleItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  desc: z.string().optional(),
  highlight: z.boolean().optional(),
  optional: z.boolean().optional(),
  badges: z.array(z.string()).optional(),
  links: z.array(LinkSchema).optional(),
  transport: z.array(TransportLinkSchema).optional(),
  guide: GuideSchema.optional(),
})

export const AlertSchema = z.object({
  type: z.enum(['tip', 'warning', 'urgent']),
  text: z.string(),
  url: z.string().optional(),
})

export const CostSchema = z.object({
  item: z.string(),
  cost: z.string(),
  total: z.boolean().optional(),
})

export const TicketSchema = z.object({
  label: z.string(),
  desc: z.string(),
  pdf: z.string().optional(),
})

export const ImageSchema = z.object({
  url: z.string(),
  caption: z.string().optional(),
})

export const TransportOptionSchema = z.object({
  name: z.string(),
  time: z.string().optional(),
  pricePerPerson: z.string().optional(),
  total: z.string().optional(),
  url: z.string().optional(),
  recommended: z.boolean().optional(),
})

export const TransportOptionsSchema = z.object({
  title: z.string(),
  options: z.array(TransportOptionSchema),
})

export const DaySchema = z.object({
  dayNum: z.number(),
  title: z.string(),
  subtitle: z.string().optional(),
  _draft: z.boolean().optional(),
  alerts: z.array(AlertSchema).optional(),
  endAlerts: z.array(AlertSchema).optional(),
  tickets: z.array(TicketSchema).optional(),
  images: z.array(ImageSchema).optional(),
  transportOptions: TransportOptionsSchema.optional(),
  schedule: z.array(ScheduleItemSchema),
  costs: z.array(CostSchema).optional(),
})

export const WifiSchema = z.object({
  name: z.string(),
  password: z.string(),
})

export const AccommodationVideoSchema = z.object({
  url: z.string(),
  label: z.string(),
})

// passthrough: Accommodation stores extra keys from user data
export const AccommodationSchema = z.object({
  address: z.string().optional(),
  mapUrl: z.string().optional(),
  host: z.string().optional(),
  gateCode: z.string().optional(),
  doorCode: z.string().optional(),
  reservationCode: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  accessNote: z.string().optional(),
  parking: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  wifi: WifiSchema.optional(),
  videos: z.array(AccommodationVideoSchema).optional(),
}).passthrough()

export const FlightSchema = z.object({
  airport: z.string().optional(),
  arrival: z.string().optional(),
  departure: z.string().optional(),
})

export const BudgetSchema = z.object({
  headline: z.string().optional(),
  lowPerFamily: z.string().optional(),
  comfortPerFamily: z.string().optional(),
  lowTotal: z.string().optional(),
  comfortTotal: z.string().optional(),
  lowPerFamilyLabel: z.string().optional(),
  comfortPerFamilyLabel: z.string().optional(),
  lowTotalLabel: z.string().optional(),
  comfortTotalLabel: z.string().optional(),
  summaryLabel: z.string().optional(),
})

export const UrgentBookingSchema = z.object({
  name: z.string(),
  reason: z.string(),
  url: z.string().optional(),
  urls: z.array(LinkSchema).optional(),
  done: z.boolean(),
})

export const UsefulLinkSchema = z.object({
  emoji: z.string(),
  name: z.string(),
  desc: z.string(),
  url: z.string(),
})

export const SavingTipSchema = z.object({
  tip: z.string(),
  saving: z.string(),
})

export const PracticalInfoSectionSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
})

export const BookingChecklistItemSchema = z.object({
  item: z.string(),
  url: z.string().optional(),
  done: z.boolean().optional(),
})

export const InsuranceDocumentSchema = z.object({
  pdf: z.string(),
  label: z.string(),
  desc: z.string(),
})

export const InsuranceSchema = InsuranceDocumentSchema.extend({
  documents: z.array(InsuranceDocumentSchema).optional(),
})

export const OverviewDaySchema = z.object({
  day: z.number(),
  date: z.string(),
  program: z.string(),
  highlights: z.string(),
})

export const TripSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  emoji: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  people: z.string(),
  destination: z.string().optional(),
  highlights: z.array(z.string()),
  accommodation: AccommodationSchema,
  flight: FlightSchema,
  budget: BudgetSchema,
  urgentBookings: z.array(UrgentBookingSchema),
  usefulLinks: z.array(UsefulLinkSchema),
  packingList: z.array(z.string()),
  savingTips: z.array(SavingTipSchema),
  savingTipsLabel: z.string().optional(),
  practicalInfo: z.array(PracticalInfoSectionSchema),
  bookingChecklist: z.array(BookingChecklistItemSchema),
  insurance: InsuranceSchema.optional(),
  overview: z.array(OverviewDaySchema),
  days: z.array(DaySchema),
  status: z.string().optional(),
  aiModel: z.string().optional(),
  expandedDays: z.array(z.number()).optional(),
})

export const TripImportDataSchema = TripSchema.partial().required({
  title: true,
  startDate: true,
  endDate: true,
})
