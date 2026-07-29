import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import { TripsProvider } from '@/context/TripsContext'
import { AdminProvider } from '@/context/AdminContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'
import { Header } from '@/components/Header'
import type { LegacyTripRedirectProps } from '@/types/routes'

const HomePage = lazy(() => import('@/pages/HomePage'))
const TripPage = lazy(() => import('@/pages/TripPage'))
const CreateTripPage = lazy(() => import('@/pages/CreateTripPage'))
const EditTripPage = lazy(() => import('@/pages/EditTripPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const AdminBackupPage = lazy(() => import('@/pages/AdminBackupPage'))
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'))
const SharedTripPage = lazy(() => import('@/pages/SharedTripPage'))

function PageLoader() {
  return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground text-sm">Betöltés...</div>
}

function LegacyTripRedirect({ edit }: LegacyTripRedirectProps) {
  const { slug } = useParams<{ slug: string }>()
  const target = slug ? `/app/trips/${slug}${edit ? '/edit' : ''}` : '/app/trips'
  return <Navigate to={target} replace />
}

// App shell: a TripsProvider (privat trip fetch) es az app Header CSAK itt fut.
// A fully public /share route ezen kivul van, sajat public headerrel.
function AppShell() {
  return (
    <TripsProvider>
      <Header />
      <Outlet />
    </TripsProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Fully public share view — NO TripsProvider (no private fetch),
                    NO app Header (no owner/admin controls), own public header */}
                <Route path="/share/:token" element={<SharedTripPage />} />

                {/* App shell — TripsProvider + app Header run only here */}
                <Route element={<AppShell />}>
                  <Route path="/" element={<Navigate to="/app/trips" replace />} />
                  <Route path="/design-system" element={<DesignSystemPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />

                  {/* Public-only auth routes (redirect to app if logged in) */}
                  <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                  <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
                  <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Protected app routes (slug-based until 15-08 migrates to tripId) */}
                  <Route path="/app/trips" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/app/trips/new" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
                  <Route path="/app/trips/:slug" element={<ProtectedRoute><TripPage /></ProtectedRoute>} />
                  <Route path="/app/trips/:slug/edit" element={<ProtectedRoute><EditTripPage /></ProtectedRoute>} />
                  <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  <Route path="/app/internal/backup" element={<ProtectedRoute><AdminBackupPage /></ProtectedRoute>} />

                  {/* Compatibility redirects from old routes */}
                  <Route path="/trip/:slug" element={<LegacyTripRedirect />} />
                  <Route path="/trip/:slug/edit" element={<LegacyTripRedirect edit />} />
                  <Route path="/create-trip" element={<Navigate to="/app/trips/new" replace />} />
                  <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </AdminProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
