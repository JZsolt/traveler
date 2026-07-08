import { createContext } from 'react'
import type { AdminContextValue } from '@/types/admin'

export const AdminContext = createContext<AdminContextValue | null>(null)
