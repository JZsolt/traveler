import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '@/components/ui/LoadingState'
import { useAuth } from '@/hooks/useAuth'
import type { AuthRouteGuardProps } from '@/types/auth'

export function ProtectedRoute({ children }: AuthRouteGuardProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingState />

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
