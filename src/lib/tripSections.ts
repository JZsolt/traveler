import type { Trip, Day, ScheduleItem } from '@/types/trip'

export function replaceTripSection<K extends keyof Trip>(trip: Trip, key: K, value: Trip[K]): Trip {
  return { ...trip, [key]: value }
}

export function updateTripDay(trip: Trip, dayNum: number, updatedDay: Partial<Day>): Trip {
  const days = [...(trip.days || [])]
  const index = days.findIndex(d => d.dayNum === dayNum)
  if (index === -1) return trip
  days[index] = { ...days[index], ...updatedDay }
  return { ...trip, days }
}

function normalizeDayNums(days: Day[]): Day[] {
  return days.map((d, i) => ({ ...d, dayNum: i + 1 }))
}

export function addDay(trip: Trip): Trip {
  const days: Day[] = [...(trip.days || []), { dayNum: 0, title: 'Új nap', subtitle: '', schedule: [] }]
  return { ...trip, days: normalizeDayNums(days) }
}

export function deleteDay(trip: Trip, dayNum: number): Trip {
  const days = (trip.days || []).filter(d => d.dayNum !== dayNum)
  return { ...trip, days: normalizeDayNums(days) }
}

export function moveDayUp(trip: Trip, dayNum: number): Trip {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx <= 0) return trip
  ;[days[idx - 1], days[idx]] = [days[idx], days[idx - 1]]
  return { ...trip, days: normalizeDayNums(days) }
}

export function moveDayDown(trip: Trip, dayNum: number): Trip {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx === -1 || idx >= days.length - 1) return trip
  ;[days[idx], days[idx + 1]] = [days[idx + 1], days[idx]]
  return { ...trip, days: normalizeDayNums(days) }
}

export function addScheduleItem(trip: Trip, dayNum: number): Trip {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx === -1) return trip
  const day = { ...days[idx] }
  day.schedule = [...(day.schedule || []), { time: '', title: 'Új program', desc: '', links: [], guide: {} }]
  days[idx] = day
  return { ...trip, days }
}

export function deleteScheduleItem(trip: Trip, dayNum: number, itemIndex: number): Trip {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx === -1) return trip
  const day = { ...days[idx] }
  day.schedule = (day.schedule || []).filter((_, i) => i !== itemIndex)
  days[idx] = day
  return { ...trip, days }
}

export function moveScheduleItem(trip: Trip, dayNum: number, itemIndex: number, direction: number): Trip {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx === -1) return trip
  const day = { ...days[idx] }
  const schedule = [...(day.schedule || [])]
  const target = itemIndex + direction
  if (target < 0 || target >= schedule.length) return trip
  ;[schedule[itemIndex], schedule[target]] = [schedule[target], schedule[itemIndex]]
  day.schedule = schedule
  days[idx] = day
  return { ...trip, days }
}

export function updateScheduleItem(trip: Trip, dayNum: number, itemIndex: number, updatedItem: Partial<ScheduleItem>): Trip {
  const days = [...(trip.days || [])]
  const dayIdx = days.findIndex(d => d.dayNum === dayNum)
  if (dayIdx === -1) return trip
  const day = { ...days[dayIdx] }
  const schedule = [...(day.schedule || [])]
  if (itemIndex < 0 || itemIndex >= schedule.length) return trip
  schedule[itemIndex] = { ...schedule[itemIndex], ...updatedItem }
  day.schedule = schedule
  days[dayIdx] = day
  return { ...trip, days }
}
