import { ReadOnlyContext } from '@/context/readOnlyContextValue'
import { useDemoTrip } from '@/hooks/useDemoTrip'
import { Page } from '@/components/ui/Page'
import { LoadingState } from '@/components/ui/LoadingState'
import { SharedHeader } from '@/components/shared/SharedHeader'
import { SharedTripView } from '@/components/shared/SharedTripView'
import { SharedTripError } from '@/components/shared/SharedTripError'
import { DEMO_HEADER_LABEL } from '@/lib/demoCopy'

function DemoTripBody() {
  const { status, trip } = useDemoTrip()

  if (status === 'loading') {
    return (
      <Page flushTop className="px-0">
        <LoadingState label="Betöltés..." className="py-20" />
      </Page>
    )
  }

  if (status === 'error' || !trip) return <SharedTripError variant="demo" />

  // Ugyanaz a read-only fa, mint a megosztott nezetnel: a szerkeszto komponensek
  // a useReadOnly alapjan nem renderelik az edit/AI/torles vezerloket.
  return (
    <ReadOnlyContext.Provider value={true}>
      <SharedTripView trip={trip} />
    </ReadOnlyContext.Provider>
  )
}

// Teljesen publikus bemutato nezet: NINCS TripsProvider (nem fut privat trip
// fetch), NINCS app Header (nincs owner/admin vezerlo) es nincs Supabase hivas —
// az adat statikus repo-adatbol jon. Lasd: docs/architecture/DEMO_TRIP_STRATEGY.md
export default function DemoTripPage() {
  return (
    <>
      <SharedHeader label={DEMO_HEADER_LABEL} />
      <DemoTripBody />
    </>
  )
}
