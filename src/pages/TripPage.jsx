import { useState } from 'react'
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { SquarePen, Trash2, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useTrips } from '@/context/TripsContext'
import { DbError } from '@/components/DbError'
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
  const navigate = useNavigate()
  const { trips, loading, error, refetch } = useTrips()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  if (loading) return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="text-center py-20 text-gray-400">
        <p className="text-2xl mb-2 animate-pulse">✈️</p>
        <p className="text-sm">Betoltes...</p>
      </div>
    </main>
  )

  if (error) return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <DbError error={error} />
    </main>
  )

  const trip = trips.find(t => t.slug === slug)

  if (!trip) return <Navigate to="/" replace />

  return (
    <main className="pb-16" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="relative">
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <Link
            to={`/trip/${slug}/edit`}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all no-underline"
          >
            <SquarePen className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              const json = JSON.stringify(trip, null, 2)
              const blob = new Blob([json], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${trip.slug}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-white/20 hover:bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <TripHero trip={trip} />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <p className="text-lg font-bold text-[#1a1a2e] mb-2">Utazas torlese</p>
            <p className="text-sm text-gray-600 mb-5">
              Biztosan torolni akarod a <strong>{trip.title}</strong> utazast? Ez a muvelet vegleges es nem vonhato vissza.
            </p>
            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                {deleteError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  setDeleting(true)
                  setDeleteError(null)
                  const { error: err } = await supabase.from('trips').delete().eq('slug', slug)
                  if (err) {
                    setDeleteError(err.message)
                    setDeleting(false)
                    return
                  }
                  await refetch()
                  navigate('/')
                }}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Torles...' : 'Igen, torold'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Megse
              </button>
            </div>
          </div>
        </div>
      )}
      <TripOverview trip={trip} />

      <div>
        {(trip.days || []).map(day => (
          <DaySection key={day.dayNum} day={day} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-10 py-6 space-y-6">
        <SavingTips tips={trip.savingTips || []} label={trip.savingTipsLabel} />
        <PracticalInfo sections={trip.practicalInfo || []} />
        <BookingChecklist items={trip.bookingChecklist || []} />
        <UsefulLinks links={trip.usefulLinks || []} />
        <PackingList items={trip.packingList || []} />

        <p className="text-center text-[10px] text-gray-400 pt-6">
          Jó utat és sok szép élményt! 🧳✨ {trip.emoji}
        </p>
      </div>
    </main>
  )
}
