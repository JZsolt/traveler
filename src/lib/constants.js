export const DEFAULT_AI_MODEL = 'gemini-3.1-flash-lite'

export const AI_MODEL_OPTIONS = [
  { value: 'gemini-3.1-flash-lite', label: '3.1 Flash Lite', desc: 'Gyors, 1000 RPD' },
  { value: 'gemini-2.5-flash', label: '2.5 Flash', desc: 'Okosabb, 250 RPD' },
]

export const ROUTES = {
  HOME: '/',
  TRIP: '/trip/:slug',
  CREATE_TRIP: '/create-trip',
  EDIT_TRIP: '/trip/:slug/edit',
  SETTINGS: '/settings',
}

export const API = {
  ADMIN_LOGIN: '/api/admin-login',
  BACKUP_TRIPS: '/api/backup-trips',
  IMPORT_TRIP: '/api/import-trip-backup',
  IMPORT_TRIPS: '/api/import-trip-backups',
  EXPAND_DAY: '/api/expand-day',
  SUGGEST_SECTION: '/api/suggest-trip-section',
  CHAT: '/api/chat',
  PLAN_TRIP: '/api/plan-trip',
}

export const ADMIN_STORAGE_KEY = 'admin_unlocked'
