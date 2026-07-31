import { Link } from 'react-router-dom'
import { Eye, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { InlineError } from '@/components/ui/InlineError'
import { LoadingState } from '@/components/ui/LoadingState'
import { sharedTripRoute } from '@/lib/constants'
import type { SharedTripCardProps, SharedTripsSectionProps } from '@/types/shared'

function SharedTripCard({ item }: SharedTripCardProps) {
  const trip = item.trip

  return (
    <Link
      to={sharedTripRoute(item.inviteId)}
      className="block bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all no-underline text-foreground"
    >
      <div className="h-44 bg-primary text-primary-foreground flex flex-col items-center justify-center relative">
        <Badge className="absolute top-3 left-3 text-[10px] uppercase tracking-wide bg-primary-foreground/15 text-primary-foreground flex items-center gap-1">
          <Eye className="w-3 h-3" /> Csak olvasható
        </Badge>
        <span className="text-4xl mb-2">{trip.emoji}</span>
        <span className="text-lg font-bold text-center px-4">{trip.title}</span>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-primary mb-1">{trip.subtitle}</p>
        <p className="text-xs text-muted-foreground mb-3">{trip.people}</p>
        <div className="flex flex-wrap gap-1.5">
          {trip.highlights.slice(0, 4).map((h) => (
            <span key={h} className="bg-muted text-primary text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              {h}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export function SharedTripsSection({ trips, loading, error, unavailableCount, onRetry }: SharedTripsSectionProps) {
  if (loading) return <LoadingState label="Megosztott utak betöltése..." className="py-16" />

  return (
    <div className="space-y-4">
      {error && <InlineError message={error} onRetry={onRetry} />}
      {unavailableCount > 0 && (
        <InlineError message={`${unavailableCount} megosztott utazás jelenleg nem elérhető.`} onRetry={onRetry} />
      )}
      {!error && trips.length === 0 ? (
        <EmptyState
          icon={<Share2 className="w-10 h-10" />}
          title="Nincs elfogadott megosztás"
          description="Az elfogadott meghívások itt jelennek meg."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trips.map((item) => <SharedTripCard key={item.inviteId} item={item} />)}
        </div>
      )}
    </div>
  )
}
