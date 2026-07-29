import { Link } from 'react-router-dom'
import { Plus, MapPin, Share2 } from 'lucide-react'
import { useTrips } from '@/hooks/useTrips'
import { useSharedSlugs } from '@/hooks/useSharedSlugs'
import { useAuth } from '@/hooks/useAuth'
import { DbError } from '@/components/DbError'
import { Badge } from '@/components/ui/badge'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { sortTrips } from '@/lib/sortTrips'
import { getTripStatus } from '@/lib/getTripStatus'
import { ROUTES, tripRoute } from '@/lib/constants'

export default function HomePage() {
  const { trips, loading, error } = useTrips()
  const sharedSlugs = useSharedSlugs()
  const { user, profile } = useAuth()
  const sorted = sortTrips(trips)

  const greeting = profile?.display_name || user?.email || ''

  if (loading) return (
    <Page constrained>
      <LoadingState label="Betoltes..." className="py-20" />
    </Page>
  )

  return (
    <Page constrained>
      <PageHeader
        title={greeting ? `Szia, ${greeting}!` : 'Az Utazasaim'}
        subtitle="Minden kirandulasom, egy helyen."
        trailing={
          <Link
            to={ROUTES.CREATE_TRIP}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-primary/80 transition-colors no-underline text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Uj utazas</span>
          </Link>
        }
      />

      {error && <DbError error={error} />}

      {!error && sorted.length === 0 && (
        <EmptyState
          icon={<MapPin className="w-10 h-10" />}
          title="Meg nincs utazasod"
          description="Tervezd meg az elso utazasodat!"
          action={
            <Link
              to={ROUTES.CREATE_TRIP}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-full shadow-sm hover:bg-primary/80 transition-colors no-underline text-sm"
            >
              <Plus className="w-4 h-4" />
              Uj utazas letrehozasa
            </Link>
          }
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sorted.map((trip) => {
          const { status, label } = getTripStatus(trip)
          return (
            <Link
              key={trip.slug}
              to={tripRoute(trip.slug)}
              className="block bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all no-underline text-foreground"
            >
              <div className="h-44 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex flex-col items-center justify-center text-white relative">
                {sharedSlugs.has(trip.slug) && (
                  <Badge className="absolute top-3 left-3 text-[10px] uppercase tracking-wide bg-white/20 text-white flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> Megosztva
                  </Badge>
                )}
                <Badge
                  className={`absolute top-3 right-3 text-[10px] uppercase tracking-wide ${
                    status === 'upcoming'
                      ? 'bg-[#e94560] text-white animate-pulse'
                      : status === 'current'
                        ? 'bg-green-500 text-white animate-pulse'
                        : 'bg-white/20 text-white'
                  }`}
                >
                  {label}
                </Badge>
                <span className="text-4xl mb-2">{trip.emoji}</span>
                <span className="text-lg font-bold text-center px-4">{trip.title}</span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-primary mb-1">
                  {trip.subtitle}
                </p>
                <p className="text-xs text-muted-foreground mb-3">{trip.people}</p>
                <div className="flex flex-wrap gap-1.5">
                  {trip.highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-muted text-primary text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Page>
  )
}
