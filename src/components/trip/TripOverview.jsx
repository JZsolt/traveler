import { AlertBox } from '@/components/AlertBox'
import { BudgetSummary } from './BudgetSummary'
import { InsuranceLink } from './InsuranceLink'

function UrgentBookings({ bookings }) {
  if (!bookings?.length) return null
  if (bookings.every(booking => booking.done)) {
    return (
      <AlertBox
        type="tip"
        text={`✅ Minden fontos foglalás MEGVAN!\n${bookings.map((booking, i) => `${i + 1}. ${booking.name} — ${booking.reason}`).join('\n')}`}
      />
    )
  }

  return (
    <AlertBox
      type="urgent"
      text={`⚠️ AZONNAL LEFOGLALANDÓ:\n${bookings.filter(booking => !booking.done).map((booking, i) => `${i + 1}. ${booking.name} — ${booking.reason}`).join('\n')}`}
    />
  )
}

export function TripOverview({ trip }) {
  return (
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
            {(trip.overview || []).map(row => (
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

      <BudgetSummary budget={trip.budget} />
      <UrgentBookings bookings={trip.urgentBookings} />
      <InsuranceLink insurance={trip.insurance} />
    </div>
  )
}
