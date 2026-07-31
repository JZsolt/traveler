import { Link } from 'react-router-dom'
import { MapPin, Plus } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ROUTES } from '@/lib/constants'
import { OwnedTripCard } from './OwnedTripCard'
import type { OwnedTripsSectionProps } from '@/types/shared'

export function OwnedTripsSection({ trips, sharedSlugs }: OwnedTripsSectionProps) {
  if (trips.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="w-10 h-10" />}
        title="Még nincs utazásod"
        description="Tervezd meg az első utazásodat!"
        action={
          <Link
            to={ROUTES.CREATE_TRIP}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-full shadow-sm hover:bg-primary/80 transition-colors no-underline text-sm"
          >
            <Plus className="w-4 h-4" />
            Új utazás létrehozása
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {trips.map((trip) => (
        <OwnedTripCard key={trip.slug} trip={trip} isShared={sharedSlugs.has(trip.slug)} />
      ))}
    </div>
  )
}
