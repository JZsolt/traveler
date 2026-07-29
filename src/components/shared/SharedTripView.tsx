import { Page } from '@/components/ui/Page'
import { DaySection } from '@/components/DaySection'
import { BookingChecklist } from '@/components/trip/BookingChecklist'
import { PackingList } from '@/components/trip/PackingList'
import { PracticalInfo } from '@/components/trip/PracticalInfo'
import { SavingTips } from '@/components/trip/SavingTips'
import { TripHero } from '@/components/trip/TripHero'
import { TripOverview } from '@/components/trip/TripOverview'
import { UsefulLinks } from '@/components/trip/UsefulLinks'
import { SharedTripCta } from './SharedTripCta'
import type { SharedTripViewProps } from '@/types/shared'

// A megosztott (read-only) trip nezet ugyanazokat a szekcio-komponenseket
// hasznalja ujra, mint a TripPage. Az edit UI-t a ReadOnlyContext rejti el
// (lasd SharedTripPage), nem duplikalunk prezentaciot. Owner-akciok (torles,
// export, uj nap, AI reszletezes) nincsenek renderelve.
const noopRefetch = () => {}

export function SharedTripView({ trip }: SharedTripViewProps) {
  const slug = trip.slug
  const days = trip.days || []

  return (
    <Page flushTop className="px-0">
      <TripHero trip={trip} slug={slug} refetch={noopRefetch} />
      <TripOverview trip={trip} slug={slug} refetch={noopRefetch} />

      <div>
        {days.map((day, idx) => (
          <DaySection
            key={day.dayNum}
            day={day}
            trip={trip}
            slug={slug}
            refetch={noopRefetch}
            isFirst={idx === 0}
            isLast={idx === days.length - 1}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-10 py-6 space-y-6">
        <SavingTips tips={trip.savingTips || []} label={trip.savingTipsLabel} trip={trip} slug={slug} refetch={noopRefetch} />
        <PracticalInfo sections={trip.practicalInfo || []} trip={trip} slug={slug} refetch={noopRefetch} />
        <BookingChecklist items={trip.bookingChecklist || []} trip={trip} slug={slug} refetch={noopRefetch} />
        <UsefulLinks links={trip.usefulLinks || []} trip={trip} slug={slug} refetch={noopRefetch} />
        <PackingList items={trip.packingList || []} trip={trip} slug={slug} refetch={noopRefetch} />

        <SharedTripCta />

        <p className="text-center text-[10px] text-gray-400 pt-6">
          Jó utat és sok szép élményt! 🧳✨ {trip.emoji}
        </p>
      </div>
    </Page>
  )
}
