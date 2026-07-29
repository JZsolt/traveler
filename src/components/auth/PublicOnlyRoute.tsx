import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '@/components/ui/LoadingState'
import { useAuth } from '@/hooks/useAuth'
import type { AuthRouteGuardProps, AuthLocationState } from '@/types/auth'

export function PublicOnlyRoute({ children }: AuthRouteGuardProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingState />

  if (user) {
    const state = location.state as AuthLocationState | null
    const redirectTo = state?.from ?? '/app/trips'
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
