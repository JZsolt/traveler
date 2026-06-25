import { useParams, Navigate } from 'react-router-dom'
import { trips } from '@/data/trips'
import { DaySection } from '@/components/DaySection'
import { BookingChecklist } from '@/components/trip/BookingChecklist'
import { PackingList } from '@/components/trip/PackingList'
import { PracticalInfo } from '@/components/trip/PracticalInfo'
import { SavingTips } from '@/components/trip/SavingTips'
import { TripHero } from '@/components/trip/TripHero'
import { TripOverview } from '@/components/trip/TripOverview'
import { UsefulLinks } from '@/components/trip/UsefulLinks'

export function TripPage() {
  const { slug } = useParams()
  const trip = trips.find(t => t.slug === slug)

  if (!trip) return <Navigate to="/" replace />

  return (
    <main className="pb-16" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <TripHero trip={trip} />
      <TripOverview trip={trip} />

      <div>
        {trip.days.map(day => (
          <DaySection key={day.dayNum} day={day} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-10 py-6 space-y-6">
        <SavingTips tips={trip.savingTips} label={trip.savingTipsLabel} />
        <PracticalInfo sections={trip.practicalInfo} />
        <BookingChecklist items={trip.bookingChecklist} />
        <UsefulLinks links={trip.usefulLinks} />
        <PackingList items={trip.packingList} />

        <p className="text-center text-[10px] text-gray-400 pt-6">
          Jó utat és sok szép élményt! 🧳✨ {trip.emoji}
        </p>
      </div>
    </main>
  )
}
