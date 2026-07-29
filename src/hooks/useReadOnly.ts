import { useContext } from 'react'
import { ReadOnlyContext } from '@/context/readOnlyContextValue'

// True, ha a komponens read-only (megosztott, public) nezetben rendereli magat.
export function useReadOnly(): boolean {
  return useContext(ReadOnlyContext)
}
