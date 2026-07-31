import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTrips } from '@/hooks/useTrips'
import { useSharedSlugs } from '@/hooks/useSharedSlugs'
import { useSharedWithMe } from '@/hooks/useSharedWithMe'
import { useAuth } from '@/hooks/useAuth'
import { DbError } from '@/components/DbError'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingState } from '@/components/ui/LoadingState'
import { DashboardTabs } from '@/components/shared/DashboardTabs'
import { PendingInvitesSection } from '@/components/shared/PendingInvitesSection'
import { SharedTripsSection } from '@/components/shared/SharedTripsSection'
import { OwnedTripsSection } from '@/components/trip/OwnedTripsSection'
import { sortTrips } from '@/lib/sortTrips'
import { ROUTES } from '@/lib/constants'
import type { DashboardTab } from '@/types/shared'

export default function HomePage() {
  const { trips, loading, error } = useTrips()
  const sharedSlugs = useSharedSlugs()
  const sharedWithMe = useSharedWithMe()
  const { user, profile } = useAuth()
  const [tab, setTab] = useState<DashboardTab>('owned')
  const sorted = sortTrips(trips)

  const greeting = profile?.display_name || user?.email || ''

  if (loading) return (
    <Page constrained>
      <LoadingState label="Betoltes..." className="py-20" />
    </Page>
  )

  return (
    <Page constrained>
      <PageHeader
        title={greeting ? `Szia, ${greeting}!` : 'Az Utazasaim'}
        subtitle="Minden kirandulasom, egy helyen."
        trailing={
          <Link
            to={ROUTES.CREATE_TRIP}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-primary/80 transition-colors no-underline text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Uj utazas</span>
          </Link>
        }
      />

      {error && <DbError error={error} />}

      {!error && (
        <DashboardTabs
          active={tab}
          ownedCount={sorted.length}
          sharedCount={sharedWithMe.sharedTrips.length}
          inviteCount={sharedWithMe.pendingInvites.length}
          onChange={setTab}
        />
      )}

      {!error && tab === 'owned' && <OwnedTripsSection trips={sorted} sharedSlugs={sharedSlugs} />}
      {!error && tab === 'shared' && (
        <SharedTripsSection
          trips={sharedWithMe.sharedTrips}
          loading={sharedWithMe.loading}
          error={sharedWithMe.error}
          unavailableCount={sharedWithMe.unavailableCount}
          onRetry={sharedWithMe.refresh}
        />
      )}
      {!error && tab === 'invites' && (
        <PendingInvitesSection
          invites={sharedWithMe.pendingInvites}
          loading={sharedWithMe.loading}
          error={sharedWithMe.error}
          unavailableCount={sharedWithMe.unavailableCount}
          busyInviteId={sharedWithMe.busyInviteId}
          onAccept={sharedWithMe.acceptInvite}
          onDecline={sharedWithMe.declineInvite}
          onRetry={sharedWithMe.refresh}
        />
      )}
    </Page>
  )
}
