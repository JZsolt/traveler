import { useParams, Navigate } from 'react-router-dom'
import { trips } from '@/data/trips'
import { DaySection } from '@/components/DaySection'
import { AlertBox } from '@/components/AlertBox'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

export function TripPage() {
  const { slug } = useParams()
  const trip = trips.find(t => t.slug === slug)

  if (!trip) return <Navigate to="/" replace />

  return (
    <main className="pb-16" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      {/* Cover */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-12 md:py-16 px-6 text-center">
        <p className="text-3xl md:text-5xl mb-3">{trip.emoji}</p>
        <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-2">{trip.title}</h1>
        <p className="text-sm opacity-80 mb-4">A tökéletes kirándulás útiterve</p>
        <div className="inline-block bg-[#e94560] px-6 py-2.5 rounded-full text-sm md:text-base font-semibold mb-4">
          {trip.subtitle}
        </div>
        <div className="text-xs md:text-sm opacity-70 max-w-md mx-auto space-y-2">
          <p>👥 {trip.people}</p>
          <p>🏠 Szállás: <a href={trip.accommodation.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-white/90 hover:text-white">{trip.accommodation.address}</a></p>
          <p>✈️ {trip.flight.airport} · Érkezés {trip.flight.arrival} → Indulás {trip.flight.departure}</p>
          <p>💰 Büdzsé: ~1000 EUR / család</p>
        </div>
      </div>

      {/* Overview */}
      <div className="max-w-3xl mx-auto px-4 md:px-10 py-6">
        <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">Útvonal áttekintés</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">Nap</th>
                <th className="p-2 text-left">Dátum</th>
                <th className="p-2 text-left">Program</th>
                <th className="p-2 text-left hidden md:table-cell">Fő élmények</th>
              </tr>
            </thead>
            <tbody>
              {trip.overview.map(row => (
                <tr key={row.day} className="border-b border-slate-100">
                  <td className="p-2 font-bold">{row.day}</td>
                  <td className="p-2">{row.date}</td>
                  <td className="p-2">{row.program}</td>
                  <td className="p-2 hidden md:table-cell text-gray-500">{row.highlights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Budget summary */}
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white p-5 rounded-2xl mt-5">
          <h3 className="text-sm md:text-base font-bold mb-1">💰 Költségvetés összesítő</h3>
          <p className="text-[10px] opacity-50 mb-3">Teljes utazás (5 nap) becsült költségei — repjegy nélkül</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { amount: trip.budget.lowPerFamily, label: "Spórolós / 1 család (2 fő + gyerek)" },
              { amount: trip.budget.comfortPerFamily, label: "Komfort / 1 család (2 fő + gyerek)" },
              { amount: trip.budget.lowTotal, label: "Spórolós / mind az 5 fő együtt" },
              { amount: trip.budget.comfortTotal, label: "Komfort / mind az 5 fő együtt" }
            ].map((b, i) => (
              <div key={i} className="bg-white/10 p-3 rounded-xl text-center">
                <div className="text-lg md:text-2xl font-extrabold text-[#e94560]">{b.amount}</div>
                <div className="text-[10px] md:text-xs opacity-70 mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent bookings */}
        <AlertBox
          type="urgent"
          text={`⚠️ AZONNAL LEFOGLALANDÓ:\n${trip.urgentBookings.map((b, i) => `${i + 1}. ${b.name} — ${b.reason}`).join('\n')}`}
        />
      </div>

      {/* Days */}
      <div>
        {trip.days.map((day, i) => (
          <DaySection key={day.dayNum} day={day} />
        ))}
      </div>

      {/* Bottom sections - only on last day's section */}
      <div className="max-w-3xl mx-auto px-4 md:px-10 py-6 space-y-6">
        {/* Saving tips */}
        <div>
          <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">💰 Pénz-spórolási tippek</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Tipp</th>
                  <th className="p-2 text-right">Megtakarítás (5 fő)</th>
                </tr>
              </thead>
              <tbody>
                {trip.savingTips.map((t, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-1.5">{i + 1}</td>
                    <td className="p-1.5">{t.tip}</td>
                    <td className="p-1.5 text-right font-semibold">{t.saving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Practical info */}
        {trip.practicalInfo && (
          <div>
            <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">ℹ️ Praktikus infók</h2>
            <div className="space-y-3">
              {trip.practicalInfo.map((section, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-2.5 rounded-lg text-[13px] md:text-[14px] font-medium text-slate-700 list-none">
                    <span>{section.title}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <ul className="mt-1.5 space-y-1 pl-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-[12px] md:text-[13px] text-slate-600 leading-[1.65] list-disc marker:text-slate-300 ml-2">{item}</li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Booking checklist */}
        <div>
          <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">☐ Foglalási checklist</h2>
          <ul className="space-y-1.5">
            {trip.bookingChecklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs py-1.5 border-b border-slate-100">
                <span className="text-base">☐</span>
                <span>
                  <strong>{item.item}</strong>
                  {item.url && (
                    <>
                      {' → '}
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#0f3460] underline">
                        Foglalás
                      </a>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Useful links */}
        <div>
          <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">🔗 Hasznos linkek</h2>
          <div className="space-y-1.5">
            {trip.usefulLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors no-underline text-[#1a1a2e]"
              >
                <span className="text-xl shrink-0">{link.emoji}</span>
                <div className="flex-1 min-w-0">
                  <strong className="block text-xs">{link.name}</strong>
                  <span className="text-[10px] text-gray-500">{link.desc}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-30 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Packing list */}
        <div>
          <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">🎒 Csomagolási emlékeztető</h2>
          <ul className="space-y-1.5">
            {trip.packingList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs py-1 border-b border-slate-100">
                <span className="text-base">☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-[10px] text-gray-400 pt-6">
          Jó utat és sok szép élményt! 🇧🇪 🌷 🧇 🍫 🍺
        </p>
      </div>
    </main>
  )
}
