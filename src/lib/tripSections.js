export function replaceTripSection(trip, key, value) {
  return { ...trip, [key]: value }
}

export function updateTripDay(trip, dayNum, updatedDay) {
  const days = [...(trip.days || [])]
  const index = days.findIndex(d => d.dayNum === dayNum)
  if (index === -1) return trip
  days[index] = { ...days[index], ...updatedDay }
  return { ...trip, days }
}

function normalizeDayNums(days) {
  return days.map((d, i) => ({ ...d, dayNum: i + 1 }))
}

export function addDay(trip) {
  const days = [...(trip.days || []), { dayNum: 0, title: 'Új nap', subtitle: '', schedule: [] }]
  return { ...trip, days: normalizeDayNums(days) }
}

export function deleteDay(trip, dayNum) {
  const days = (trip.days || []).filter(d => d.dayNum !== dayNum)
  return { ...trip, days: normalizeDayNums(days) }
}

export function moveDayUp(trip, dayNum) {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx <= 0) return trip
  ;[days[idx - 1], days[idx]] = [days[idx], days[idx - 1]]
  return { ...trip, days: normalizeDayNums(days) }
}

export function moveDayDown(trip, dayNum) {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx === -1 || idx >= days.length - 1) return trip
  ;[days[idx], days[idx + 1]] = [days[idx + 1], days[idx]]
  return { ...trip, days: normalizeDayNums(days) }
}

export function addScheduleItem(trip, dayNum) {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx === -1) return trip
  const day = { ...days[idx] }
  day.schedule = [...(day.schedule || []), { time: '', title: 'Új program', desc: '', links: [], guide: {} }]
  days[idx] = day
  return { ...trip, days }
}

export function deleteScheduleItem(trip, dayNum, itemIndex) {
  const days = [...(trip.days || [])]
  const idx = days.findIndex(d => d.dayNum === dayNum)
  if (idx === -1) return trip
  const day = { ...days[idx] }
  day.schedule = (day.schedule || []).filter((_, i) => i !== itemIndex)
  days[idx] = day
  return { ...trip, days }
}

export function moveScheduleItem(trip, dayNum, itemIndex, direction) {
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

export function updateScheduleItem(trip, dayNum, itemIndex, updatedItem) {
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
