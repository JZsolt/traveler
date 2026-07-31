import { useState } from 'react'
import { apiClient, mapApiError } from '@/lib/apiClient'
import { API } from '@/lib/constants'
import { SendTripInviteEmailResponseSchema } from '@/schemas/emailInvites'
import type { UseTripInviteEmailParams, UseTripInviteEmailReturn } from '@/types/emailInvites'

function statusMessage(status: string): string {
  if (status === 'duplicate') return 'Erre az email címre nemrég már elküldtük a meghívót.'
  return 'Email meghívó elküldve.'
}

export function useTripInviteEmail({ slug }: UseTripInviteEmailParams): UseTripInviteEmailReturn {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function send() {
    setMessage(null)
    setError(null)
    setBusy(true)
    try {
      const res = await apiClient.post(API.SEND_TRIP_INVITE_EMAIL, { slug, recipientEmail: email })
      const parsed = SendTripInviteEmailResponseSchema.safeParse(res.data)
      if (!parsed.success) throw new Error('Hibas valasz a szervertol.')
      setMessage(statusMessage(parsed.data.status))
      if (parsed.data.status === 'sent') setEmail('')
    } catch (err) {
      setError(mapApiError(err))
    } finally {
      setBusy(false)
    }
  }

  return { email, busy, message, error, setEmail, send }
}
