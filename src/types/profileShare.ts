import type { z } from 'zod'
import type {
  ProfileShareManagementRequestSchema,
  ProfileShareManagementResponseSchema,
  ProfileShareStateSchema,
} from '@/schemas/profileShare'

export type ProfileShareManagementRequest = z.infer<typeof ProfileShareManagementRequestSchema>
export type ProfileShareManagementResponse = z.infer<typeof ProfileShareManagementResponseSchema>
export type ProfileShareState = z.infer<typeof ProfileShareStateSchema>
export type ProfileShareAction = ProfileShareManagementRequest['action']

export interface UseProfileShareReturn {
  loading: boolean
  busy: boolean
  error: string | null
  profileShare: ProfileShareState | null
  profileShareUrl: string | null
  refresh: () => Promise<void>
  enable: () => Promise<void>
  rotate: () => Promise<void>
  disable: () => Promise<void>
}

export interface ProfileShareSettingsProps {
  profileName: string | null
}

export interface ProfileShareResolverState {
  copied: boolean
}
