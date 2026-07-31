import type { z } from 'zod'
import type {
  SendTripInviteEmailRequestSchema,
  SendTripInviteEmailResponseSchema,
} from '@/schemas/emailInvites'

export type SendTripInviteEmailRequest = z.infer<typeof SendTripInviteEmailRequestSchema>
export type SendTripInviteEmailResponse = z.infer<typeof SendTripInviteEmailResponseSchema>
export type SendTripInviteEmailStatus = SendTripInviteEmailResponse['status']

export interface TripInviteEmailConfig {
  apiKey: string
  from: string
  appUrl: string
}

export interface TripInviteEmailContext {
  tripId: string
  title: string
  subtitle: string
}

export interface TripInviteEmailSendParams {
  to: string
  ownerEmail: string | null
  tripTitle: string
  tripSubtitle: string
  shareUrl: string
}

export type TripInviteEmailOutcome =
  | { ok: true; status: SendTripInviteEmailStatus }
  | { ok: false; status: number; code: string; message: string }

export type PublicShareUrlOutcome =
  | { ok: true; shareUrl: string }
  | { ok: false; status: number; code: string; message: string }

export interface UseTripInviteEmailParams {
  slug: string
}

export interface UseTripInviteEmailReturn {
  email: string
  busy: boolean
  message: string | null
  error: string | null
  setEmail: (value: string) => void
  send: () => Promise<void>
}

export interface TripInviteEmailFormProps {
  slug: string
}
