import { useParams, Navigate } from 'react-router-dom'
import { ReadOnlyContext } from '@/context/readOnlyContextValue'
import { useSharedWithMe } from '@/hooks/useSharedWithMe'
import { Page } from '@/components/ui/Page'
import { LoadingState } from '@/components/ui/LoadingState'
import { InlineError } from '@/components/ui/InlineError'
import { SharedTripView } from '@/components/shared/SharedTripView'
import { ROUTES } from '@/lib/constants'
import type { SharedWithMeTripPageState } from '@/types/shared'

export default function SharedWithMeTripPage() {
  const { inviteId } = useParams<{ inviteId: string }>()
  const shared = useSharedWithMe()
  const item = inviteId ? shared.sharedTrips.find((candidate) => candidate.inviteId === inviteId) : null
  const state: SharedWithMeTripPageState = shared.loading
    ? { status: 'loading', trip: null }
    : shared.error
      ? { status: 'error', trip: null }
      : item
        ? { status: 'ok', trip: item.trip }
        : { status: 'notfound', trip: null }

  if (state.status === 'loading') {
    return (
      <Page flushTop className="px-0">
        <LoadingState label="Megosztott utazás betöltése..." className="py-20" />
      </Page>
    )
  }

  if (state.status === 'error') {
    return (
      <Page constrained>
        <InlineError message={shared.error ?? 'Nem sikerült betölteni a megosztott utazást.'} onRetry={shared.refresh} />
      </Page>
    )
  }

  if (!state.trip) return <Navigate to={ROUTES.TRIPS} replace />

  return (
    <ReadOnlyContext.Provider value={true}>
      <SharedTripView trip={state.trip} />
    </ReadOnlyContext.Provider>
  )
}
