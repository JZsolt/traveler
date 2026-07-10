import { useParams, Navigate } from 'react-router-dom'
import { parseSlug } from '@/schemas/route'
import { useTrips } from '@/hooks/useTrips'
import { useAdmin } from '@/hooks/useAdmin'
import { EditTripFormPanel } from '@/components/EditTripFormPanel'
import { Page } from '@/components/ui/Page'
import { LoadingState } from '@/components/ui/LoadingState'

export default function EditTripPage() {
  const { isAdminUnlocked } = useAdmin()
  const { slug: rawSlug } = useParams<{ slug: string }>()
  const slug = parseSlug(rawSlug)
  const { trips, loading: tripsLoading, refetch } = useTrips()

  if (!isAdminUnlocked) return <Navigate to="/settings" replace />

  if (tripsLoading) return (
    <Page flushTop className="px-0">
      <LoadingState label="Betoltes..." className="py-20" />
    </Page>
  )

  const trip = trips.find(t => t.slug === slug)
  if (!trip || !slug) return <Navigate to="/" replace />

  return (
    <Page flushTop className="px-0">
      <EditTripFormPanel key={slug} trip={trip} slug={slug} refetch={refetch} />
    </Page>
  )
}
