import { useCallback, useEffect, useState } from 'react'
import { apiClient, mapApiError } from '@/lib/apiClient'
import { API, shareLinkUrl } from '@/lib/constants'
import { TripShareManagementResponseSchema } from '@/schemas/sharing'
import type { ActiveShare, ManagedShare, TripShareManagementRequest } from '@/types/api'
import type { TripSharingReturn, UseTripSharingParams } from '@/types/shared'

type ShareAction = TripShareManagementRequest['action']

function isShareActive(share: ActiveShare | null): boolean {
  if (!share) return false
  return !share.expires_at || new Date(share.expires_at).getTime() > Date.now()
}

// Minden owner share-muvelet az osszevont sharing API-n megy at
// (owner-verified, szerver-oldali). Nincs kliens-oldali trip_shares mutacio, es a
// token dekodolasa is szerver oldalon tortenik. A "get" a re-displayelheto aktiv
// link tokenjet is visszaadja, igy a modal ujranyitaskor is mutatja a linket.
export function useTripSharing({ slug }: UseTripSharingParams): TripSharingReturn {
  const [activeShare, setActiveShare] = useState<ActiveShare | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyShare = useCallback((share: ManagedShare | null) => {
    if (share) {
      setActiveShare({ id: share.id, created_at: share.createdAt, expires_at: share.expiresAt })
      setToken(share.token)
    } else {
      setActiveShare(null)
      setToken(null)
    }
  }, [])

  const call = useCallback(async (action: ShareAction): Promise<ManagedShare | null> => {
    const res = await apiClient.post(API.TRIP_SHARE_MANAGEMENT, { slug, action })
    const parsed = TripShareManagementResponseSchema.safeParse(res.data)
    if (!parsed.success) throw new Error('Hibas valasz a szervertol.')
    return parsed.data.share
  }, [slug])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      applyShare(await call('get'))
    } catch (err) {
      setError(mapApiError(err))
    } finally {
      setLoading(false)
    }
  }, [call, applyShare])

  const runAction = useCallback(async (action: ShareAction) => {
    setBusy(true)
    setError(null)
    try {
      applyShare(await call(action))
    } catch (err) {
      setError(mapApiError(err))
    } finally {
      setBusy(false)
    }
  }, [call, applyShare])

  const createLink = useCallback(() => runAction('create'), [runAction])
  const disable = useCallback(() => runAction('revoke'), [runAction])
  const regenerate = useCallback(() => runAction('regenerate'), [runAction])

  useEffect(() => {
    let active = true
    // A refresh() szinkron setState-tel indul; microtaskba toljuk, hogy ne
    // fusson szinkron az effect body-ban (react-hooks/set-state-in-effect).
    queueMicrotask(() => { if (active) void refresh() })
    return () => { active = false }
  }, [refresh])

  const active = isShareActive(activeShare)
  return {
    loading,
    busy,
    error,
    activeShare,
    isActive: active,
    // Vedelem: csak akkor mutassunk linket, ha a share tenylegesen aktiv (nem
    // lejart) ES van (dekodolhato) token — igy nem tunhet elonek egy olyan link,
    // amit a public lookup mar lejartkent elutasitana.
    shareUrl: token && active ? shareLinkUrl(token) : null,
    refresh,
    createLink,
    disable,
    regenerate,
  }
}
