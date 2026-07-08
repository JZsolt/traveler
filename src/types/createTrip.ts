export interface DraftDay {
  day: number
  title: string
  summary?: string
  items?: { time?: string; title: string; type?: string; note?: string }[]
}

export interface Draft {
  title?: string
  emoji?: string
  startDate?: string
  endDate?: string
  people?: string
  destination?: string
  tips?: string[]
  days?: DraftDay[]
}

export interface CreateTripForm {
  destination: string
  startDate: string
  endDate?: string
  people?: string
}
