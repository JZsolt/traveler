import { z } from 'zod';
import type {
  ValidatedTripRow,
  BackupFile,
  BackupManifestFile,
  BackupFilesResult,
} from '../src/types/apiServer';
import { TripBackupEnvelopeSchema } from '../src/schemas/backup.js';

const BACKUP_BASE = 'backups/trips';
const MANIFEST_PATH = `${BACKUP_BASE}/manifest.json`;

const TripTitleSchema = z.object({ title: z.string() });

const ManifestSchema = z.object({
  version: z.number(),
  application: z.string(),
  schema: z.number(),
  exportedAt: z.string().datetime(),
  tripCount: z.number(),
  trips: z.array(z.object({
    slug: z.string(),
    title: z.string(),
    path: z.string(),
    updated_at: z.string(),
  })),
});

function sanitizeSlug(slug: string | undefined, fallbackId: string | undefined): string {
  const safe = (slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  return safe || fallbackId || 'unknown';
}

function tripPath(slug: string | undefined, fallbackId: string | undefined): string {
  return `${BACKUP_BASE}/by-slug/${sanitizeSlug(slug, fallbackId)}.json`;
}

function buildTripBackup(row: ValidatedTripRow, exportedAt: string) {
  const envelope = {
    version: 1,
    application: 'Traveler' as const,
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
  };
  const validated = TripBackupEnvelopeSchema.safeParse(envelope);
  if (!validated.success) {
    throw new Error(`Invalid backup envelope for slug=${row.slug}`);
  }
  return validated.data;
}

function getTripTitle(row: ValidatedTripRow): string {
  const parsed = TripTitleSchema.safeParse(row.trip_data);
  return parsed.success ? parsed.data.title : row.slug;
}

function buildManifest(rows: ValidatedTripRow[], exportedAt: string) {
  const manifest = {
    version: 1,
    application: 'Traveler',
    schema: 1,
    exportedAt,
    tripCount: rows.length,
    trips: rows.map((row) => ({
      slug: row.slug,
      title: getTripTitle(row),
      path: tripPath(row.slug, row.id),
      updated_at: row.updated_at,
    })),
  };
  const validated = ManifestSchema.safeParse(manifest);
  if (!validated.success) {
    throw new Error('Invalid manifest structure');
  }
  return validated.data;
}

function buildBackupFiles(
  validRows: ValidatedTripRow[],
  exportedAt: string,
): BackupFilesResult {
  const files: BackupFile[] = validRows.map((row) => ({
    path: tripPath(row.slug, row.id),
    content: JSON.stringify(buildTripBackup(row, exportedAt)),
    slug: sanitizeSlug(row.slug, row.id),
  }));

  const manifest: BackupManifestFile = {
    path: MANIFEST_PATH,
    content: JSON.stringify(buildManifest(validRows, exportedAt)),
  };

  return { files, manifest };
}

export {
  BACKUP_BASE,
  MANIFEST_PATH,
  sanitizeSlug,
  tripPath,
  buildTripBackup,
  buildManifest,
  buildBackupFiles,
};
