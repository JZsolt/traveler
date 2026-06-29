const BACKUP_BASE = 'backups/trips'
const MANIFEST_PATH = `${BACKUP_BASE}/manifest.json`

function sanitizeSlug(slug, fallbackId) {
  const safe = (slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '')
  return safe || fallbackId || 'unknown'
}

function tripPath(slug, fallbackId) {
  return `${BACKUP_BASE}/by-slug/${sanitizeSlug(slug, fallbackId)}.json`
}

function buildTripBackup(row, exportedAt) {
  return {
    version: 1,
    application: 'Traveler',
    schema: 1,
    exportedAt,
    trip: {
      id: row.id,
      slug: row.slug,
      trip_data: row.trip_data,
      owner: row.owner,
      created_at: row.created_at,
      updated_at: row.updated_at,
    },
  }
}

function buildManifest(rows, exportedAt) {
  return {
    version: 1,
    application: 'Traveler',
    schema: 1,
    exportedAt,
    tripCount: rows.length,
    trips: rows.map(row => ({
      slug: row.slug,
      title: row.trip_data?.title || row.slug,
      path: tripPath(row.slug, row.id),
      updated_at: row.updated_at,
    })),
  }
}

function buildBackupFiles(rows, exportedAt) {
  const files = rows.map(row => ({
    path: tripPath(row.slug, row.id),
    content: JSON.stringify(buildTripBackup(row, exportedAt)),
    slug: sanitizeSlug(row.slug, row.id),
  }))

  const manifest = {
    path: MANIFEST_PATH,
    content: JSON.stringify(buildManifest(rows, exportedAt)),
  }

  return { files, manifest }
}

export {
  BACKUP_BASE,
  MANIFEST_PATH,
  sanitizeSlug,
  tripPath,
  buildTripBackup,
  buildManifest,
  buildBackupFiles,
}
