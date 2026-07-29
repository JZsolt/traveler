import { useParams } from 'react-router-dom'
import { ReadOnlyContext } from '@/context/readOnlyContextValue'
import { useSharedTrip } from '@/hooks/useSharedTrip'
import { Page } from '@/components/ui/Page'
import { LoadingState } from '@/components/ui/LoadingState'
import { SharedHeader } from '@/components/shared/SharedHeader'
import { SharedTripView } from '@/components/shared/SharedTripView'
import { SharedTripError } from '@/components/shared/SharedTripError'

function SharedTripBody() {
  const { token } = useParams<{ token: string }>()
  const { status, trip } = useSharedTrip(token)

  if (status === 'loading') {
    return (
      <Page flushTop className="px-0">
        <LoadingState label="Betöltés..." className="py-20" />
      </Page>
    )
  }

  if (status === 'notfound') return <SharedTripError variant="notfound" />
  if (status === 'error' || !trip) return <SharedTripError variant="error" />

  // A teljes megosztott fa read-only: a szerkeszto komponensek elrejtik az
  // edit UI-jukat (useReadOnly), igy nem jelenik meg edit/AI/torles vezerlo.
  return (
    <ReadOnlyContext.Provider value={true}>
      <SharedTripView trip={trip} />
    </ReadOnlyContext.Provider>
  )
}

// Onallo public shell: NINCS TripsProvider (nem fut privat trip fetch) es NINCS
// app Header (nincs owner/admin vezerlo) — csak a public SharedHeader.
export default function SharedTripPage() {
  return (
    <>
      <SharedHeader />
      <SharedTripBody />
    </>
  )
}
