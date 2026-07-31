import adminLogin from '../api/admin-login.js'
import backupTrips from '../api/backup-trips.js'
import chat from '../api/chat.js'
import expandDay from '../api/expand-day.js'
import importTripBackup from '../api/import-trip-backup.js'
import importTripBackups from '../api/import-trip-backups.js'
import planTrip from '../api/plan-trip.js'
import sharing from '../api/sharing.js'
import suggestTripSection from '../api/suggest-trip-section.js'
import type { ApiHandler } from './types.js'

export const apiRoutes: Record<string, ApiHandler> = {
  '/api/admin-login': adminLogin,
  '/api/backup-trips': backupTrips,
  '/api/chat': chat,
  '/api/expand-day': expandDay,
  '/api/import-trip-backup': importTripBackup,
  '/api/import-trip-backups': importTripBackups,
  '/api/plan-trip': planTrip,
  '/api/sharing': sharing,
  '/api/suggest-trip-section': suggestTripSection,
}
