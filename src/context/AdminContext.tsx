import { useState, useCallback } from 'react'
import { AdminContext } from './adminContextValue'
import { API, ADMIN_STORAGE_KEY } from '@/lib/constants'
import type { AdminProviderProps } from '@/types/admin'

export function AdminProvider({ children }: AdminProviderProps) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_STORAGE_KEY) === '1')

  const unlockAdmin = useCallback(async (password: string) => {
    try {
      const res = await fetch(API.ADMIN_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data: { error?: { message?: string } } | null = await res.json().catch(() => null)
        return { ok: false as const, error: data?.error?.message || 'Szerverhiba. Probald ujra kesobb.' }
      }
      const data: { ok?: boolean; error?: { message?: string } } = await res.json()
      if (data.ok) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, '1')
        setUnlocked(true)
        return { ok: true as const }
      }
      return { ok: false as const, error: data.error?.message || 'Ismeretlen hiba.' }
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
