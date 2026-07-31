import { Link } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { tripRoute } from '@/lib/constants'
import { getTripStatus } from '@/lib/getTripStatus'
import type { OwnedTripCardProps } from '@/types/shared'

export function OwnedTripCard({ trip, isShared }: OwnedTripCardProps) {
  const { status, label } = getTripStatus(trip)

  return (
    <Link
      to={tripRoute(trip.slug)}
      className="block bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all no-underline text-foreground"
    >
      <div className="h-44 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex flex-col items-center justify-center text-white relative">
        {isShared && (
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
        <p className="text-sm font-semibold text-primary mb-1">{trip.subtitle}</p>
        <p className="text-xs text-muted-foreground mb-3">{trip.people}</p>
        <div className="flex flex-wrap gap-1.5">
          {trip.highlights.map((h) => (
            <span key={h} className="bg-muted text-primary text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              {h}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
