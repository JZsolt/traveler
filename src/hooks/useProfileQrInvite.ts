import { useState } from 'react'
import { apiClient, mapApiError } from '@/lib/apiClient'
import { API } from '@/lib/constants'
import { extractProfileShareId } from '@/lib/profileShare'
import { RecipientResponseSchema } from '@/schemas/recipients'
import type { UseProfileQrInviteParams, UseProfileQrInviteReturn } from '@/types/shared'

function statusMessage(status: string): string {
  if (status === 'invited') return 'Meghívás elküldve. A másik fél elfogadás után látja az utazást.'
  if (status === 'already_invited') return 'Ehhez az utazáshoz már van aktív meghívás ennek a felhasználónak.'
  if (status === 'self') return 'Saját magadat nem hívhatod meg.'
  if (status === 'invite_limit') return 'Túl sok függő meghívás van ennél a felhasználónál.'
  return 'Nem található aktív profil QR ehhez az azonosítóhoz.'
}

export function useProfileQrInvite({ slug }: UseProfileQrInviteParams): UseProfileQrInviteReturn {
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function invite() {
    const publicShareId = extractProfileShareId(input)
    setMessage(null)
    setError(null)
    if (!publicShareId) {
      setError('Nem érvényes profil QR link vagy azonosító.')
      return
    }

    setBusy(true)
    try {
      const res = await apiClient.post(API.TRIP_RECIPIENTS, { action: 'invite', slug, publicShareId })
      const parsed = RecipientResponseSchema.safeParse(res.data)
      if (!parsed.success) throw new Error('Hibas valasz a szervertol.')
      setMessage(statusMessage(parsed.data.status))
      if (parsed.data.status === 'invited') setInput('')
    } catch (err) {
      setError(mapApiError(err))
    } finally {
      setBusy(false)
    }
  }

  return { input, busy, message, error, setInput, invite }
}
