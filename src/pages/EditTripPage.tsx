import { useParams, Navigate } from 'react-router-dom'
import { useTrips } from '@/hooks/useTrips'
import { useAdmin } from '@/hooks/useAdmin'
import { EditTripFormPanel } from '@/components/EditTripFormPanel'

export function EditTripPage() {
  const { isAdminUnlocked } = useAdmin()
  const { slug } = useParams<{ slug: string }>()
  const { trips, loading: tripsLoading, refetch } = useTrips()

  if (!isAdminUnlocked) return <Navigate to="/settings" replace />

  if (tripsLoading) return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="text-center py-20 text-gray-400">
        <p className="text-2xl mb-2 animate-pulse">✈️</p>
        <p className="text-sm">Betoltes...</p>
      </div>
    </main>
  )

  const trip = trips.find(t => t.slug === slug)
  if (!trip || !slug) return <Navigate to="/" replace />

  return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <EditTripFormPanel key={slug} trip={trip} slug={slug} refetch={refetch} />
    </main>
  )
}
