import { Link } from 'react-router-dom'
import { trips } from '@/data/trips'
import { Badge } from '@/components/ui/badge'

function getTripStatus(trip) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const start = new Date(trip.startDate)
  const end = new Date(trip.endDate)

  if (now < start) {
    const days = Math.ceil((start - now) / 86400000)
    return { status: 'upcoming', label: `${days} nap mulva` }
  } else if (now >= start && now <= end) {
    return { status: 'current', label: 'Most!' }
  }
  return { status: 'past', label: 'Volt' }
}

export function HomePage() {
  const sorted = [...trips].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white text-center py-16 px-6 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">✈️ Az Utazásaim</h1>
        <p className="text-base opacity-80 font-light">Minden kirándulás, egy helyen, linkekkel, menetrenddel, mindennel.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map(trip => {
            const { status, label } = getTripStatus(trip)
            return (
              <Link
                key={trip.slug}
                to={`/trip/${trip.slug}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all no-underline text-[#1a1a2e]"
              >
                <div className="h-44 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex flex-col items-center justify-center text-white relative">
                  <Badge
                    className={`absolute top-3 right-3 text-[10px] uppercase tracking-wide ${
                      status === 'upcoming' ? 'bg-[#e94560] text-white animate-pulse' :
                      status === 'current' ? 'bg-green-500 text-white animate-pulse' :
                      'bg-white/20 text-white'
                    }`}
                  >
                    {label}
                  </Badge>
                  <span className="text-4xl mb-2">{trip.emoji}</span>
                  <span className="text-lg font-bold text-center px-4">{trip.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-[#0f3460] mb-1">{trip.subtitle}</p>
                  <p className="text-xs text-gray-500 mb-3">👥 {trip.people}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trip.highlights.map(h => (
                      <span key={h} className="bg-slate-100 text-[#0f3460] text-[11px] font-medium px-2.5 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
