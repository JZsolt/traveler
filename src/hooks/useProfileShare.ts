import { useCallback, useEffect, useRef, useState } from 'react'
import { apiClient, mapApiError } from '@/lib/apiClient'
import { API, profileShareUrl } from '@/lib/constants'
import { ProfileShareManagementResponseSchema } from '@/schemas/profileShare'
import type { ProfileShareAction, ProfileShareState, UseProfileShareReturn } from '@/types/profileShare'

export function useProfileShare(): UseProfileShareReturn {
  const mountedRef = useRef(true)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileShare, setProfileShare] = useState<ProfileShareState | null>(null)

  const run = useCallback(async (action: ProfileShareAction) => {
    const isGet = action === 'get'
    if (mountedRef.current) {
      if (isGet) setLoading(true)
      else setBusy(true)
      setError(null)
    }

    try {
      const res = await apiClient.post(API.PROFILE_SHARE_MANAGEMENT, { action })
      const parsed = ProfileShareManagementResponseSchema.safeParse(res.data)
      if (!parsed.success) throw new Error('Hibas valasz a szervertol.')
      if (mountedRef.current) setProfileShare(parsed.data.profileShare)
    } catch (err) {
      if (mountedRef.current) setError(mapApiError(err))
    } finally {
      if (mountedRef.current) {
        if (isGet) setLoading(false)
        else setBusy(false)
      }
    }
  }, [])

  const refresh = useCallback(() => run('get'), [run])
  const enable = useCallback(() => run('enable'), [run])
  const rotate = useCallback(() => run('rotate'), [run])
  const disable = useCallback(() => run('disable'), [run])

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
    busy,
    error,
    profileShare,
    profileShareUrl: profileShare?.enabled && profileShare.publicShareId
      ? profileShareUrl(profileShare.publicShareId)
      : null,
    refresh,
    enable,
    rotate,
    disable,
  }
}
