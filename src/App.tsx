import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TripsProvider } from '@/context/TripsContext'
import { AdminProvider } from '@/context/AdminContext'
import { Header } from '@/components/Header'

const HomePage = lazy(() => import('@/pages/HomePage'))
const TripPage = lazy(() => import('@/pages/TripPage'))
const CreateTripPage = lazy(() => import('@/pages/CreateTripPage'))
const EditTripPage = lazy(() => import('@/pages/EditTripPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

function PageLoader() {
  return <div className="flex items-center justify-center min-h-[60vh] text-slate-400 text-sm">Betöltés...</div>
}

export default function App() {
  return (
    <BrowserRouter>
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
            </Routes>
          </Suspense>
        </TripsProvider>
      </AdminProvider>
    </BrowserRouter>
  )
}
