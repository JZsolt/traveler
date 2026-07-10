import type { z } from 'zod'
import type {
  BackupResultSchema,
  ImportBackupResultSchema,
  ImportSingleBackupResponseSchema,
} from '@/schemas/apiResponses'

export interface DbErrorProps {
  error: { message?: string } | undefined
}

export type BackupState = 'idle' | 'loading' | 'success' | 'partial' | 'error'

export type BackupResult = z.infer<typeof BackupResultSchema>

export type ImportBackupMode = 'create' | 'upsert-by-slug'
export type ImportBackupState = 'idle' | 'loading' | 'success' | 'partial' | 'error'

export interface ParsedBackupFile {
  name: string
  data: unknown
}

export type ImportBackupResult = z.infer<typeof ImportBackupResultSchema>

export type ImportSingleBackupResponse = z.infer<typeof ImportSingleBackupResponseSchema>
