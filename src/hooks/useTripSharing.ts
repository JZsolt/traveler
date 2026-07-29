import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { supabase } from '@/lib/supabase'
import { apiClient, mapApiError } from '@/lib/apiClient'
import { API, shareLinkUrl } from '@/lib/constants'
import { friendlyError } from '@/lib/friendlyError'
import { useAuth } from '@/hooks/useAuth'
import { ActiveShareSchema, CreateTripShareResponseSchema } from '@/schemas/sharing'
import type { ActiveShare } from '@/types/api'
import type { TripSharingReturn, UseTripSharingParams } from '@/types/shared'

function mapShareError(err: unknown): string {
  return axios.isAxiosError(err) ? mapApiError(err) : friendlyError(err)
}

function isShareActive(share: ActiveShare | null): boolean {
  if (!share) return false
  return !share.expires_at || new Date(share.expires_at).getTime() > Date.now()
}

export function useTripSharing({ slug }: UseTripSharingParams): TripSharingReturn {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const tripIdRef = useRef<string | null>(null)
  const [activeShare, setActiveShare] = useState<ActiveShare | null>(null)
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolveTripId = useCallback(async (): Promise<string | null> => {
    if (tripIdRef.current) return tripIdRef.current
    if (!supabase || !userId) return null
    const { data, error: queryError } = await supabase
      .from('trips')
      .select('id')
      .eq('slug', slug)
      .eq('owner_id', userId)
      .maybeSingle()
    // A valodi query hibat (permission/env/network/schema) tovabb dobjuk, hogy
    // NE olvadjon ossze a "nincs sor" (nem talalhato) esettel.
    if (queryError) throw queryError
    const id = data && typeof data.id === 'string' ? data.id : null
    tripIdRef.current = id
    return id
  }, [slug, userId])

  const applyCreated = useCallback((token: string, share: ActiveShare) => {
    setCreatedToken(token)
    setActiveShare(share)
  }, [])

  const doCreate = useCallback(async (id: string) => {
    const res = await apiClient.post(API.CREATE_TRIP_SHARE, { tripId: id })
    const parsed = CreateTripShareResponseSchema.safeParse(res.data)
    if (!parsed.success) throw new Error('Hibas valasz a szervertol.')
    const { id: shareId, token, createdAt, expiresAt } = parsed.data.share
    applyCreated(token, { id: shareId, created_at: createdAt, expires_at: expiresAt })
  }, [applyCreated])

  // Visszaadja, hogy tenylegesen visszavont-e egy aktiv sort. A unique index
  // miatt legfeljebb 1 nem-visszavont sor van trip-enkent, igy maybeSingle biztos.
  const doRevoke = useCallback(async (id: string): Promise<boolean> => {
    if (!supabase) throw new Error('Supabase nincs konfiguralva.')
    const { data, error: revokeError } = await supabase
      .from('trip_shares')
      .update({ revoked_at: new Date().toISOString() })
      .eq('trip_id', id)
      .is('revoked_at', null)
      .select('id')
      .maybeSingle()
    if (revokeError) throw revokeError
    return !!data
  }, [])

  const runAction = useCallback(async (fn: (id: string) => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      const id = await resolveTripId()
      if (!id) {
        setError('Az utazas nem talalhato vagy nincs jogosultsagod megosztani.')
        return
      }
      await fn(id)
    } catch (err) {
      setError(mapShareError(err))
    } finally {
      setBusy(false)
    }
  }, [resolveTripId])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const id = await resolveTripId()
      if (!id || !supabase) {
        setActiveShare(null)
        return
      }
      const { data, error: queryError } = await supabase
        .from('trip_shares')
        .select('id, created_at, expires_at')
        .eq('trip_id', id)
        .is('revoked_at', null)
        .maybeSingle()
      if (queryError) throw queryError
      const parsed = data ? ActiveShareSchema.safeParse(data) : null
      setActiveShare(parsed?.success ? parsed.data : null)
    } catch (err) {
      setError(mapShareError(err))
    } finally {
      setLoading(false)
    }
  }, [resolveTripId])

  const createLink = useCallback(() => runAction(doCreate), [runAction, doCreate])

  const disable = useCallback(() => runAction(async (id) => {
    const revoked = await doRevoke(id)
    setCreatedToken(null)
    if (revoked) {
      setActiveShare(null)
    } else {
      // Nem volt mit visszavonni (stale UI / mar visszavonva) — a valos DB
      // allapotot toltjuk ujra, hogy ne tunjon hamis sikernek a "Kikapcsolas".
      await refresh()
    }
  }), [runAction, doRevoke, refresh])

  const regenerate = useCallback(() => runAction(async (id) => {
    await doRevoke(id)
    await doCreate(id)
  }), [runAction, doRevoke, doCreate])

  useEffect(() => {
    let active = true
    // A refresh() szinkron setState-tel indul; microtaskba toljuk, hogy ne
    // fusson szinkron az effect body-ban (react-hooks/set-state-in-effect).
    queueMicrotask(() => { if (active) void refresh() })
    return () => { active = false }
  }, [refresh])

  return {
    loading,
    busy,
    error,
    activeShare,
    isActive: isShareActive(activeShare),
    shareUrl: createdToken ? shareLinkUrl(createdToken) : null,
    refresh,
    createLink,
    disable,
    regenerate,
  }
}
