import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TripsProvider } from '@/context/TripsContext'
import { Header } from '@/components/Header'
import { HomePage } from '@/pages/HomePage'
import { TripPage } from '@/pages/TripPage'
import { CreateTripPage } from '@/pages/CreateTripPage'
import { EditTripPage } from '@/pages/EditTripPage'

export default function App() {
  return (
    <BrowserRouter>
      <TripsProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trip/:slug" element={<TripPage />} />
          <Route path="/create-trip" element={<CreateTripPage />} />
          <Route path="/trip/:slug/edit" element={<EditTripPage />} />
        </Routes>
      </TripsProvider>
    </BrowserRouter>
  )
}
