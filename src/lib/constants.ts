export const DEFAULT_AI_MODEL = 'gemini-3.1-flash-lite'

export const AI_MODEL_OPTIONS = [
  { value: 'gemini-3.1-flash-lite', label: '3.1 Flash Lite', desc: 'Gyors, 1000 RPD' },
  { value: 'gemini-2.5-flash', label: '2.5 Flash', desc: 'Okosabb, 250 RPD' },
] as const

export const ROUTES = {
  HOME: '/',
  TRIPS: '/app/trips',
  TRIP: '/app/trips/:slug',
  CREATE_TRIP: '/app/trips/new',
  EDIT_TRIP: '/app/trips/:slug/edit',
  SHARED_TRIP: '/app/shared/:inviteId',
  PROFILE_SHARE: '/app/profile-share/:publicShareId',
  SETTINGS: '/app/settings',
  ADMIN_BACKUP: '/app/internal/backup',
  LOGIN: '/login',
  REGISTER: '/register',
  SHARE: '/share/:token',
} as const

export const API = {
  ADMIN_LOGIN: '/api/admin-login',
  BACKUP_TRIPS: '/api/backup-trips',
  IMPORT_TRIP: '/api/import-trip-backup',
  IMPORT_TRIPS: '/api/import-trip-backups',
  EXPAND_DAY: '/api/expand-day',
  SUGGEST_SECTION: '/api/suggest-trip-section',
  CHAT: '/api/chat',
  PLAN_TRIP: '/api/plan-trip',
  SHARED_TRIP: '/api/sharing?route=shared-trip',
  TRIP_SHARE_MANAGEMENT: '/api/sharing?route=trip-share-management',
  TRIP_RECIPIENTS: '/api/sharing?route=trip-recipients',
  SHARED_WITH_ME: '/api/sharing?route=shared-with-me',
  PROFILE_SHARE_MANAGEMENT: '/api/sharing?route=profile-share-management',
  SEND_TRIP_INVITE_EMAIL: '/api/sharing?route=send-trip-invite-email',
} as const


export function tripRoute(slug: string): string {
  return `/app/trips/${slug}`
}

export function sharedTripRoute(inviteId: string): string {
  return `/app/shared/${inviteId}`
}

export function profileShareRoute(publicShareId: string): string {
  return `/app/profile-share/${publicShareId}`
}

export function editTripRoute(slug: string): string {
  return `/app/trips/${slug}/edit`
}

export function shareLinkUrl(token: string): string {
  return `${window.location.origin}/share/${token}`
}

export function profileShareUrl(publicShareId: string): string {
  return `${window.location.origin}${profileShareRoute(publicShareId)}`
}
