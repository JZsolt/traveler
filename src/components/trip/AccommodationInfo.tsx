import type { Accommodation } from '@/types/trip'

interface AccommodationInfoProps {
  accommodation: Accommodation | undefined
}

function hasAccommodationData(a: Accommodation | undefined) {
  if (!a) return false
  return !!(
    a.host ||
    a.address ||
    a.reservationCode ||
    a.checkIn ||
    a.checkOut ||
    a.accessNote ||
    a.parking ||
    a.contactEmail ||
    a.contactPhone ||
    a.gateCode ||
    a.doorCode ||
    a.wifi ||
    a.videos?.length
  )
}

export function AccommodationInfo({ accommodation }: AccommodationInfoProps) {
  if (!hasAccommodationData(accommodation)) return null

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto text-left text-xs md:text-sm space-y-2">
      <p className="text-center font-semibold text-sm mb-3">🏠 Szállás infó</p>
      {accommodation?.host && <p>👤 Szállás: {accommodation.host}</p>}
      {accommodation?.reservationCode && <p>🧾 Online check-in kód: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{accommodation.reservationCode}</span></p>}
      {accommodation?.checkIn && <p>🛎️ Check-in: {accommodation.checkIn}</p>}
      {accommodation?.checkOut && <p>🚪 Check-out: {accommodation.checkOut}</p>}
      {accommodation?.accessNote && <p>📍 Bejutás: {accommodation.accessNote}</p>}
      {accommodation?.parking && <p>🅿️ Parkolás: {accommodation.parking}</p>}
      {accommodation?.contactEmail && <p>✉️ Email: <a href={`mailto:${accommodation.contactEmail}`} className="underline underline-offset-2 text-white/90 hover:text-white">{accommodation.contactEmail}</a></p>}
      {accommodation?.contactPhone && <p>☎️ Telefon: <a href={`tel:${accommodation.contactPhone}`} className="underline underline-offset-2 text-white/90 hover:text-white">{accommodation.contactPhone}</a></p>}
      {accommodation?.gateCode && <p>🔑 Kapu kód: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{accommodation.gateCode}</span></p>}
      {accommodation?.doorCode && <p>🚪 Bejárat kód: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{accommodation.doorCode}</span></p>}
      {accommodation?.wifi && (
        <p>📶 WiFi: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{accommodation.wifi.name}</span> · Jelszó: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{accommodation.wifi.password}</span></p>
      )}
      {accommodation?.videos && (
        <div className="flex flex-wrap gap-2 pt-1">
          {accommodation.videos.map((video, i) => (
            <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-[#e94560] hover:bg-[#d63d56] px-3 py-1.5 rounded-full text-xs font-medium transition-colors">
              ▶ {video.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
