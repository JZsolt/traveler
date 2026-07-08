import type { RefObject } from 'react'
import type {
  BookingChecklistItem,
  Budget,
  Insurance,
  PracticalInfoSection,
  SavingTip,
  Trip,
  UrgentBooking,
  UsefulLink,
} from './trip'

export interface InsuranceLinkProps {
  insurance: Insurance | undefined
}

export interface TripOverviewProps {
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface UrgentBookingsProps {
  bookings: UrgentBooking[]
}

export interface BudgetDraft {
  headline: string
  summaryLabel: string
  lowPerFamily: string
  lowPerFamilyLabel: string
  comfortPerFamily: string
  comfortPerFamilyLabel: string
  lowTotal: string
  lowTotalLabel: string
  comfortTotal: string
  comfortTotalLabel: string
}

export interface BudgetEditorProps {
  draft: BudgetDraft
  onChange: (draft: BudgetDraft) => void
}

export interface BudgetField {
  amount: keyof BudgetDraft
  label: keyof BudgetDraft
  defaultLabel: string
}

export interface BudgetSummaryProps {
  budget: Budget | undefined
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface PackingListEditorProps {
  items: string[]
  onChange: (items: string[]) => void
}

export interface PackingListProps {
  items: string[] | undefined
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface SavingTipsEditorProps {
  items: SavingTip[]
  onChange: (items: SavingTip[]) => void
  validationError: string | null
}

export interface SavingTipsProps {
  tips: SavingTip[] | undefined
  label: string | undefined
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface UsefulLinksEditorProps {
  items: UsefulLink[]
  onChange: (items: UsefulLink[]) => void
  validationError: string | null
}

export interface UsefulLinksProps {
  links: UsefulLink[] | undefined
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface BookingChecklistEditorProps {
  items: BookingChecklistItem[]
  onChange: (items: BookingChecklistItem[]) => void
  validationError: string | null
}

export interface BookingChecklistProps {
  items: BookingChecklistItem[] | undefined
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface PracticalInfoEditableSection extends PracticalInfoSection {
  _eid?: number
}

export interface PracticalInfoEditorProps {
  sections: PracticalInfoEditableSection[]
  onChange: (sections: PracticalInfoEditableSection[]) => void
  validationError: string | null
}

export interface PracticalInfoItemsEditorProps {
  items: string[]
  onChange: (items: string[]) => void
}

export interface PracticalInfoSuggestionItem {
  label: string
  value: string
}

export interface PracticalInfoSuggestionSection {
  title: string
  items?: PracticalInfoSuggestionItem[]
}

export interface PracticalInfoProps {
  sections: PracticalInfoSection[] | undefined
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
}

export interface HeroDraft {
  title: string
  emoji: string
  people: string
  startDate: string
  endDate: string
  accom: {
    address: string
    mapUrl: string
    host: string
    gateCode: string
    doorCode: string
    wifi: { name: string; password: string } | null
  }
  flight: {
    airport: string
    arrival: string
    departure: string
  }
}

export type HeroAccommodationTextField = 'address' | 'mapUrl' | 'host' | 'gateCode' | 'doorCode'

export interface HeroEditorProps {
  draft: HeroDraft
  onChange: (draft: HeroDraft) => void
}

export interface TripHeroProps {
  trip: Trip
  slug: string
  refetch: () => Promise<void> | void
  editRef?: RefObject<{ edit: () => void } | null>
}
