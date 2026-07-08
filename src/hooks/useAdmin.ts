import { useContext } from 'react'
import { AdminContext } from '@/context/adminContextValue'
import type { AdminContextValue } from '@/types/admin'

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
