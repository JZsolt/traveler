import { Link, useLocation } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useTrips } from '@/hooks/useTrips'

export function Header() {
  const location = useLocation()
  const { trips } = useTrips()
  const isTrip = location.pathname.startsWith('/trip/')
  const slug = location.pathname.split('/trip/')[1]
  const trip = slug ? trips.find(t => t.slug === slug) : null

  return (
    <>
      {/* Safe area spacer — fills the notch/dynamic island area */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <header
        className="fixed left-0 right-0 z-50 bg-[#1a1a2e] text-white h-14 flex items-center justify-between px-4 shadow-lg"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <Link to="/" className="flex items-center gap-2 font-bold text-base tracking-tight no-underline text-white">
          <span className="text-xl">✈️</span>
          <span>Az Utazásaim</span>
        </Link>
        <div className="flex items-center gap-3">
          {isTrip && trip && (
            <div className="text-xs opacity-70 flex items-center gap-1.5 max-w-[50vw] truncate">
              <Link to="/" className="text-white no-underline hover:opacity-100">Utazásaim</Link>
              <span className="opacity-40">›</span>
              <span className="truncate">{trip.title}</span>
            </div>
          )}
          <Link to="/settings" aria-label="Beállítások" className="text-white/60 hover:text-white transition-colors p-1">
            <Settings className="w-4.5 h-4.5" />
          </Link>
        </div>
      </header>
    </>
  )
}
