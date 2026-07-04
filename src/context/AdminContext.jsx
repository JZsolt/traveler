import { useState, useCallback } from 'react'
import { AdminContext } from './adminContextValue'
import { API, ADMIN_STORAGE_KEY } from '@/lib/constants'

export function AdminProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_STORAGE_KEY) === '1')

  const unlockAdmin = useCallback(async (password) => {
    try {
      const res = await fetch(API.ADMIN_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        return { ok: false, error: data?.error?.message || 'Szerverhiba. Probald ujra kesobb.' }
      }
      const data = await res.json()
      if (data.ok) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, '1')
        setUnlocked(true)
        return { ok: true }
      }
      return { ok: false, error: data.error?.message || 'Ismeretlen hiba.' }
    } catch {
      return { ok: false, error: 'Nem sikerult kapcsolodni a szerverhez.' }
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
