import type { ReactNode } from 'react'

export interface AdminContextValue {
  isAdminUnlocked: boolean
  unlockAdmin: (password: string) => Promise<{ ok: boolean; error?: string }>
  lockAdmin: () => void
}

export interface AdminProviderProps {
  children: ReactNode
}
