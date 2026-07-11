import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { TripsProvider } from '@/context/TripsContext'
import { AdminProvider } from '@/context/AdminContext'
import { Header } from '@/components/Header'

const HomePage = lazy(() => import('@/pages/HomePage'))
const TripPage = lazy(() => import('@/pages/TripPage'))
const CreateTripPage = lazy(() => import('@/pages/CreateTripPage'))
const EditTripPage = lazy(() => import('@/pages/EditTripPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'))

function PageLoader() {
  return <div className="flex items-center justify-center min-h-[60vh] text-slate-400 text-sm">Betöltés...</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <TripsProvider>
            <Header />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/trip/:slug" element={<TripPage />} />
                <Route path="/create-trip" element={<CreateTripPage />} />
                <Route path="/trip/:slug/edit" element={<EditTripPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/design-system" element={<DesignSystemPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
              </Routes>
            </Suspense>
          </TripsProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
