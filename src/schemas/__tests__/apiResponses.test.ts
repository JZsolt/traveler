import { describe, it, expect } from 'vitest'
import {
  BackupResultSchema,
  GitHubCommitResultSchema,
  GitHubContentSchema,
  SupabaseTripRowSchema,
  ImportBackupResultSchema,
  ImportSingleBackupResponseSchema,
} from '../apiResponses'

describe('BackupResultSchema', () => {
  const validResult = {
    ok: true,
    exportedAt: '2026-07-01T12:00:00.000Z',
    tripCount: 3,
    fileCount: 4,
    manifestPath: 'backups/trips/manifest.json',
    commits: [],
    failedFiles: [],
    skippedCount: 0,
    skippedSlugs: [],
  }

  it('accepts a valid full success result', () => {
    const result = BackupResultSchema.safeParse(validResult)
    expect(result.success).toBe(true)
  })

  it('accepts partial failure result', () => {
    const partial = {
      ...validResult,
      ok: false,
      skippedCount: 1,
      skippedSlugs: ['bad-trip'],
      failedFiles: [{ path: 'backups/x.json', error: 'timeout' }],
    }
    const result = BackupResultSchema.safeParse(partial)
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    expect(BackupResultSchema.safeParse({}).success).toBe(false)
    expect(BackupResultSchema.safeParse({ ok: true }).success).toBe(false)
  })

  it('rejects invalid exportedAt format', () => {
    const invalid = { ...validResult, exportedAt: 'not-a-date' }
    expect(BackupResultSchema.safeParse(invalid).success).toBe(false)
  })
})

describe('GitHubCommitResultSchema', () => {
  it('accepts valid commit result', () => {
    const result = GitHubCommitResultSchema.safeParse({
      commit: {
        sha: 'abc123',
        html_url: 'https://github.com/user/repo/commit/abc123',
      },
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing commit', () => {
    expect(GitHubCommitResultSchema.safeParse({}).success).toBe(false)
  })

  it('rejects invalid url', () => {
    const result = GitHubCommitResultSchema.safeParse({
      commit: { sha: 'abc', html_url: 'not-a-url' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing sha', () => {
    const result = GitHubCommitResultSchema.safeParse({
      commit: { html_url: 'https://github.com/x' },
    })
    expect(result.success).toBe(false)
  })
})

describe('GitHubContentSchema', () => {
  it('accepts object with sha', () => {
    expect(GitHubContentSchema.safeParse({ sha: 'abc' }).success).toBe(true)
  })

  it('rejects missing sha', () => {
    expect(GitHubContentSchema.safeParse({}).success).toBe(false)
  })
})

describe('SupabaseTripRowSchema', () => {
  const validRow = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    slug: 'rome-2026',
    trip_data: { title: 'Rome' },
    owner: null,
    created_at: '2026-07-01T12:00:00.000Z',
    updated_at: '2026-07-01T12:00:00.000Z',
  }

  it('accepts a valid row', () => {
    const result = SupabaseTripRowSchema.safeParse(validRow)
    expect(result.success).toBe(true)
  })

  it('trip_data stays as unknown', () => {
    const result = SupabaseTripRowSchema.safeParse(validRow)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.trip_data).toEqual({ title: 'Rome' })
    }
  })

  it('rejects invalid uuid', () => {
    const invalid = { ...validRow, id: 'not-a-uuid' }
    expect(SupabaseTripRowSchema.safeParse(invalid).success).toBe(false)
  })

  it('rejects empty slug', () => {
    const invalid = { ...validRow, slug: '' }
    expect(SupabaseTripRowSchema.safeParse(invalid).success).toBe(false)
  })

  it('rejects invalid datetime', () => {
    const invalid = { ...validRow, created_at: '2026-07-01' }
    expect(SupabaseTripRowSchema.safeParse(invalid).success).toBe(false)
  })

  it('accepts null owner', () => {
    expect(SupabaseTripRowSchema.safeParse(validRow).success).toBe(true)
  })

  it('accepts string owner', () => {
    const withOwner = { ...validRow, owner: 'user@example.com' }
    expect(SupabaseTripRowSchema.safeParse(withOwner).success).toBe(true)
  })
})

describe('ImportBackupResultSchema', () => {
  it('accepts valid import result', () => {
    const result = ImportBackupResultSchema.safeParse({
      importedCount: 2,
      failedCount: 0,
      results: [{ slug: 'trip-1', created: true }],
      errors: [],
    })
    expect(result.success).toBe(true)
  })

  it('accepts result with errors', () => {
    const result = ImportBackupResultSchema.safeParse({
      importedCount: 1,
      failedCount: 1,
      results: [{ slug: 'trip-1', updated: true }],
      errors: [{ index: 1, slug: 'trip-2', error: 'Invalid' }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    expect(ImportBackupResultSchema.safeParse({}).success).toBe(false)
  })
})

describe('ImportSingleBackupResponseSchema', () => {
  it('accepts success response', () => {
    const result = ImportSingleBackupResponseSchema.safeParse({
      ok: true,
      slug: 'trip-1',
      created: true,
    })
    expect(result.success).toBe(true)
  })

  it('accepts error response', () => {
    const result = ImportSingleBackupResponseSchema.safeParse({
      ok: false,
      error: { message: 'Invalid format' },
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty object (all optional)', () => {
    expect(ImportSingleBackupResponseSchema.safeParse({}).success).toBe(true)
  })
})
