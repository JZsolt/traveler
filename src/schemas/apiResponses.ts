import { z } from 'zod'

// --- GitHub Content API responses ---

export const GitHubContentSchema = z.object({
  sha: z.string(),
})

export const GitHubCommitResultSchema = z.object({
  commit: z.object({
    sha: z.string(),
    html_url: z.string().url(),
  }),
})

// --- Backup/import API responses ---

export const BackupCommitSchema = z.object({
  path: z.string().optional(),
  slug: z.string().optional(),
  commitSha: z.string().nullable(),
  commitUrl: z.string().nullable(),
})

export const BackupFailedFileSchema = z.object({
  path: z.string(),
  error: z.string(),
})

export const BackupResultSchema = z.object({
  ok: z.boolean(),
  exportedAt: z.string().datetime(),
  tripCount: z.number(),
  fileCount: z.number(),
  manifestPath: z.string(),
  commits: z.array(BackupCommitSchema).optional(),
  failedFiles: z.array(BackupFailedFileSchema).optional(),
  skippedCount: z.number(),
  skippedSlugs: z.array(z.string()),
})

export const SupabaseTripRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  trip_data: z.unknown(),
  owner: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const ImportBackupRowSchema = z.object({
  slug: z.string(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
})

export const ImportBackupErrorSchema = z.object({
  index: z.number().optional(),
  slug: z.string().optional(),
  error: z.string(),
})

export const ImportBackupResultSchema = z.object({
  importedCount: z.number(),
  failedCount: z.number(),
  results: z.array(ImportBackupRowSchema),
  errors: z.array(ImportBackupErrorSchema),
  fileNames: z.array(z.string()).optional(),
})

export const ImportSingleBackupResponseSchema = z.object({
  ok: z.boolean().optional(),
  slug: z.string().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  error: z.object({
    message: z.string().optional(),
  }).optional(),
})
