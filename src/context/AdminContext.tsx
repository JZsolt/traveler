import { useState, useCallback } from 'react'
import { AdminContext } from './adminContextValue'
import { API } from '@/lib/constants'
import { apiClient, mapApiError } from '@/lib/apiClient'
import { AdminLoginResponseSchema } from '@/schemas/auth'
import type { AdminProviderProps } from '@/types/admin'

export function AdminProvider({ children }: AdminProviderProps) {
  const [unlocked, setUnlocked] = useState(false)

  const unlockAdmin = useCallback(async (password: string) => {
    try {
      const { data: raw } = await apiClient.post(API.ADMIN_LOGIN, { password })
      const parsed = AdminLoginResponseSchema.safeParse(raw)
      if (!parsed.success || !parsed.data.ok) {
        const errMsg = parsed.success ? parsed.data.error?.message : undefined
        return { ok: false as const, error: errMsg || 'Szerverhiba. Probald ujra kesobb.' }
      }
      setUnlocked(true)
      return { ok: true as const }
    } catch (err) {
      return { ok: false as const, error: mapApiError(err) }
    }
  }, [])

  const lockAdmin = useCallback(() => {
    setUnlocked(false)
  }, [])

  return (
    <AdminContext.Provider value={{ isAdminUnlocked: unlocked, unlockAdmin, lockAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}
