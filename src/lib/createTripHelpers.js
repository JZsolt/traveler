import { formatDateRange } from '@/lib/dateUtils'

export function toSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function draftToTripData(draft, form) {
  const slug = toSlug(draft.title || form.destination)
  return {
    slug,
    title: draft.title || form.destination,
    subtitle: formatDateRange(draft.startDate || form.startDate, draft.endDate || form.endDate),
    emoji: draft.emoji || '',
    startDate: draft.startDate || form.startDate,
    endDate: draft.endDate || form.endDate,
    people: draft.people || form.people || '',
    highlights: [],
    status: 'draft',
    expandedDays: [],
    destination: draft.destination || form.destination,
    accommodation: { address: '', mapUrl: '' },
    flight: { airport: '', arrival: '', departure: '' },
    budget: { headline: '' },
    urgentBookings: [],
    usefulLinks: [],
    packingList: [],
    savingTips: (draft.tips || []).map(t => ({ tip: t, saving: '' })),
    practicalInfo: [],
    bookingChecklist: [],
    overview: (draft.days || []).map(d => ({
      day: d.day,
      date: '',
      program: d.title,
      highlights: d.summary || '',
    })),
    days: (draft.days || []).map(d => ({
      dayNum: d.day,
      title: d.title,
      subtitle: d.summary || '',
      tickets: [],
      images: [],
      alerts: [],
      schedule: (d.items || []).map(item => ({
        time: item.time || '',
        title: item.title,
        desc: item.note || '',
        highlight: item.type === 'sight',
        badges: item.type === 'food' ? ['ETTEREM'] : [],
        links: [],
        guide: {},
      })),
      costs: [],
      endAlerts: [],
      _draft: true,
    })),
  }
}

export const DETAIL_OPTIONS = [
  { value: 'quick', label: 'Gyors', desc: 'Max 3 program/nap' },
  { value: 'normal', label: 'Normal', desc: 'Max 4 program/nap' },
  { value: 'detailed', label: 'Reszletes', desc: 'Max 6 program/nap' },
]
