import { useState } from 'react'
import type { AdminUnlockProps, AdminUnlockReturn } from '@/types/hooks'

export function useAdminUnlock({ unlockAdmin }: AdminUnlockProps): AdminUnlockReturn {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await unlockAdmin(password)
      if (!result.ok) {
        setError(result.error ?? null)
      } else {
        setPassword('')
      }
    } finally {
      setLoading(false)
    }
  }

  return { password, setPassword, loading, error, handleUnlock }
}
