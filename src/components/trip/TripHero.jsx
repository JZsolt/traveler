function getTransportEmoji(airport = '') {
  const lower = airport.toLowerCase()
  if (lower.includes('autó') || lower.includes('auto')) return '🚗'
  if (lower.includes('vonat')) return '🚆'
  if (lower.includes('busz')) return '🚌'
  if (lower.includes('komp') || lower.includes('hajó')) return '⛴️'
  return '✈️'
}

export function TripHero({ trip }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-12 md:py-16 px-6 text-center">
      <p className="text-3xl md:text-5xl mb-3">{trip.emoji}</p>
      <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-2">{trip.title}</h1>
      <p className="text-sm opacity-80 mb-4">A tökéletes kirándulás útiterve</p>
      <div className="inline-block bg-[#e94560] px-6 py-2.5 rounded-full text-sm md:text-base font-semibold mb-4">
        {trip.subtitle}
      </div>
      <div className="text-xs md:text-sm opacity-70 max-w-md mx-auto space-y-2">
        <p>👥 {trip.people}</p>
        {trip.accommodation?.address && (
          <p>
            🏠 Szállás:{' '}
            <a href={trip.accommodation.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-white/90 hover:text-white">
              {trip.accommodation.address}
            </a>
          </p>
        )}
        {trip.flight?.airport && (
          <p>{getTransportEmoji(trip.flight.airport)} {trip.flight.airport} · Érkezés {trip.flight.arrival} → Indulás {trip.flight.departure}</p>
        )}
        {trip.budget?.headline && (
          <p>💰 Büdzsé: {trip.budget.headline}</p>
        )}
      </div>

      {trip.accommodation?.host && (
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto text-left text-xs md:text-sm space-y-2">
          <p className="text-center font-semibold text-sm mb-3">🏠 Szállás infó</p>
          <p>👤 Házigazda: {trip.accommodation.host}</p>
          {trip.accommodation.gateCode && <p>🔑 Kapu kód: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.gateCode}</span></p>}
          {trip.accommodation.doorCode && <p>🚪 Bejárat kód: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.doorCode}</span></p>}
          {trip.accommodation.wifi && (
            <p>📶 WiFi: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.wifi.name}</span> · Jelszó: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.wifi.password}</span></p>
          )}
          {trip.accommodation.videos && (
            <div className="flex flex-wrap gap-2 pt-1">
              {trip.accommodation.videos.map((video, i) => (
                <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-[#e94560] hover:bg-[#d63d56] px-3 py-1.5 rounded-full text-xs font-medium transition-colors">
                  ▶ {video.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
