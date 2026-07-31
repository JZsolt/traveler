import { useCallback, useEffect, useRef, useState } from 'react'
import { apiClient, mapApiError } from '@/lib/apiClient'
import { API } from '@/lib/constants'
import { SharedWithMeResponseSchema } from '@/schemas/sharing'
import { RecipientResponseSchema } from '@/schemas/recipients'
import type { SharedWithMeState } from '@/types/shared'

export function useSharedWithMe(): SharedWithMeState {
  const mountedRef = useRef(true)
  const refreshSeqRef = useRef(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sharedTrips, setSharedTrips] = useState<SharedWithMeState['sharedTrips']>([])
  const [pendingInvites, setPendingInvites] = useState<SharedWithMeState['pendingInvites']>([])
  const [unavailableCount, setUnavailableCount] = useState(0)
  const [busyInviteId, setBusyInviteId] = useState<string | null>(null)

  const canUpdate = useCallback((seq: number) => mountedRef.current && refreshSeqRef.current === seq, [])

  const refresh = useCallback(async () => {
    const seq = refreshSeqRef.current + 1
    refreshSeqRef.current = seq
    if (mountedRef.current) {
      setLoading(true)
      setError(null)
    }
    try {
      const res = await apiClient.get(API.SHARED_WITH_ME)
      const parsed = SharedWithMeResponseSchema.safeParse(res.data)
      if (!parsed.success) throw new Error('Hibas valasz a szervertol.')
      if (!canUpdate(seq)) return
      setSharedTrips(parsed.data.sharedTrips)
      setPendingInvites(parsed.data.pendingInvites)
      setUnavailableCount(parsed.data.unavailableCount)
    } catch (err) {
      if (!canUpdate(seq)) return
      setError(mapApiError(err))
    } finally {
      if (canUpdate(seq)) setLoading(false)
    }
  }, [canUpdate])

  const respond = useCallback(async (inviteId: string, action: 'accept' | 'decline') => {
    if (mountedRef.current) {
      setBusyInviteId(inviteId)
      setError(null)
    }
    try {
      const res = await apiClient.post(API.TRIP_RECIPIENTS, { action, inviteId })
      const parsed = RecipientResponseSchema.safeParse(res.data)
      if (!parsed.success) throw new Error('Hibas valasz a szervertol.')
      await refresh()
    } catch (err) {
      if (mountedRef.current) setError(mapApiError(err))
    } finally {
      if (mountedRef.current) setBusyInviteId(null)
    }
  }, [refresh])

  const acceptInvite = useCallback((inviteId: string) => respond(inviteId, 'accept'), [respond])
  const declineInvite = useCallback((inviteId: string) => respond(inviteId, 'decline'), [respond])

  useEffect(() => {
    mountedRef.current = true
    queueMicrotask(() => {
      if (mountedRef.current) void refresh()
    })
    return () => {
      mountedRef.current = false
    }
  }, [refresh])

  return {
    loading,
    error,
    sharedTrips,
    pendingInvites,
    unavailableCount,
    busyInviteId,
    refresh,
    acceptInvite,
    declineInvite,
  }
}
