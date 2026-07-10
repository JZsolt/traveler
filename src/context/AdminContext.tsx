import { useState, useCallback } from 'react'
import { AdminContext } from './adminContextValue'
import { API, ADMIN_STORAGE_KEY } from '@/lib/constants'
import { AdminLoginResponseSchema } from '@/schemas/auth'
import { AdminStorageSchema } from '@/schemas/storage'
import type { AdminProviderProps } from '@/types/admin'

export function AdminProvider({ children }: AdminProviderProps) {
  const [unlocked, setUnlocked] = useState(() => {
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY)
    const parsed = AdminStorageSchema.safeParse(stored)
    if (!parsed.success && stored !== null) {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    }
    return parsed.success && parsed.data === '1'
  })

  const unlockAdmin = useCallback(async (password: string) => {
    try {
      const res = await fetch(API.ADMIN_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const raw: unknown = await res.json().catch(() => null)
      const parsed = AdminLoginResponseSchema.safeParse(raw)
      if (!res.ok || !parsed.success || !parsed.data.ok) {
        const errMsg = parsed.success ? parsed.data.error?.message : undefined
        return { ok: false as const, error: errMsg || 'Szerverhiba. Probald ujra kesobb.' }
      }
      sessionStorage.setItem(ADMIN_STORAGE_KEY, '1')
      setUnlocked(true)
      return { ok: true as const }
    } catch {
      return { ok: false as const, error: 'Nem sikerult kapcsolodni a szerverhez.' }
    }
  }, [])

  const lockAdmin = useCallback(() => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    setUnlocked(false)
  }, [])

  return (
    <AdminContext.Provider value={{ isAdminUnlocked: unlocked, unlockAdmin, lockAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}
