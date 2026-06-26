const MONTHS = [
  'január', 'február', 'március', 'április', 'május', 'június',
  'július', 'augusztus', 'szeptember', 'október', 'november', 'december',
]

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return ''
  const s = new Date(startDate + 'T00:00:00')
  const e = new Date(endDate + 'T00:00:00')
  if (isNaN(s) || isNaN(e)) return ''

  const sYear = s.getFullYear()
  const eYear = e.getFullYear()
  const sMonth = MONTHS[s.getMonth()]
  const eMonth = MONTHS[e.getMonth()]
  const sDay = s.getDate()
  const eDay = e.getDate()

  if (sYear !== eYear) {
    return `${sYear}. ${sMonth} ${sDay}. – ${eYear}. ${eMonth} ${eDay}.`
  }
  if (s.getMonth() !== e.getMonth()) {
    return `${sYear}. ${sMonth} ${sDay}. – ${eMonth} ${eDay}.`
  }
  return `${sYear}. ${sMonth} ${sDay}–${eDay}.`
}
