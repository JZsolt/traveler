import type { z } from 'zod'
import type {
  LinkSchema, TransportLinkSchema, GuideSchema, ScheduleItemSchema,
  AlertSchema, CostSchema, TicketSchema, ImageSchema,
  TransportOptionSchema, TransportOptionsSchema, DaySchema,
  WifiSchema, AccommodationVideoSchema, AccommodationSchema,
  FlightSchema, BudgetSchema, UrgentBookingSchema, UsefulLinkSchema,
  SavingTipSchema, PracticalInfoSectionSchema, BookingChecklistItemSchema,
  InsuranceDocumentSchema, InsuranceSchema, OverviewDaySchema, TripSchema,
  TripImportDataSchema,
} from '@/schemas/trip'

export type Link = z.infer<typeof LinkSchema>
export type TransportLink = z.infer<typeof TransportLinkSchema>
export type Guide = z.infer<typeof GuideSchema>
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>
export type Alert = z.infer<typeof AlertSchema>
export type Cost = z.infer<typeof CostSchema>
export type Ticket = z.infer<typeof TicketSchema>
export type Image = z.infer<typeof ImageSchema>
export type TransportOption = z.infer<typeof TransportOptionSchema>
export type TransportOptions = z.infer<typeof TransportOptionsSchema>
export type Day = z.infer<typeof DaySchema>
export type Wifi = z.infer<typeof WifiSchema>
export type AccommodationVideo = z.infer<typeof AccommodationVideoSchema>
export type Accommodation = z.infer<typeof AccommodationSchema>
export type Flight = z.infer<typeof FlightSchema>
export type Budget = z.infer<typeof BudgetSchema>
export type UrgentBooking = z.infer<typeof UrgentBookingSchema>
export type UsefulLink = z.infer<typeof UsefulLinkSchema>
export type SavingTip = z.infer<typeof SavingTipSchema>
export type PracticalInfoSection = z.infer<typeof PracticalInfoSectionSchema>
export type BookingChecklistItem = z.infer<typeof BookingChecklistItemSchema>
export type InsuranceDocument = z.infer<typeof InsuranceDocumentSchema>
export type Insurance = z.infer<typeof InsuranceSchema>
export type OverviewDay = z.infer<typeof OverviewDaySchema>
export type Trip = z.infer<typeof TripSchema>
export type TripImportData = z.infer<typeof TripImportDataSchema>

export interface TripStatus {
  status: 'upcoming' | 'current' | 'past'
  label: string
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

export type AccommodationTextField =
  | 'host'
  | 'gateCode'
  | 'doorCode'
  | 'reservationCode'
  | 'checkIn'
  | 'checkOut'
  | 'accessNote'
  | 'parking'
  | 'contactEmail'
  | 'contactPhone'
