export interface DbErrorProps {
  error: { message?: string } | undefined
}

export type BackupState = 'idle' | 'loading' | 'success' | 'partial' | 'error'

export interface BackupCommit {
  commitSha?: string
  commitUrl?: string
}

export interface BackupFailedFile {
  path: string
  error: string
}

export interface BackupResult {
  exportedAt: string
  tripCount: number
  fileCount: number
  manifestPath: string
  commits?: BackupCommit[]
  failedFiles?: BackupFailedFile[]
}

export type ImportBackupMode = 'create' | 'upsert-by-slug'
export type ImportBackupState = 'idle' | 'loading' | 'success' | 'partial' | 'error'

export interface ParsedBackupFile {
  name: string
  data: unknown
}

export interface ImportBackupRow {
  slug: string
  created?: boolean
  updated?: boolean
}

export interface ImportBackupError {
  index?: number
  slug?: string
  error: string
}

export interface ImportBackupResult {
  importedCount: number
  failedCount: number
  results: ImportBackupRow[]
  errors: ImportBackupError[]
  fileNames?: string[]
}

export interface ImportSingleBackupResponse {
  ok?: boolean
  slug?: string
  created?: boolean
  updated?: boolean
  error?: { message?: string }
}
