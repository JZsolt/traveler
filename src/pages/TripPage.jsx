import { useState } from 'react'
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { SquarePen, Trash2, Download, Wand2 } from 'lucide-react'
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
  const [expandingDay, setExpandingDay] = useState(null)
  const [expandError, setExpandError] = useState(null)

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

  const isDraft = trip.status === 'draft'
  const expandedDays = trip.expandedDays || []

  async function handleExpandDay(dayNum) {
    setExpandingDay(dayNum)
    setExpandError(null)

    const day = trip.days.find(d => d.dayNum === dayNum)
    if (!day) return

    try {
      const res = await fetch('/api/expand-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripTitle: trip.title,
          destination: trip.destination || '',
          dayNumber: dayNum,
          currentDay: {
            title: day.title,
            summary: day.subtitle || '',
            items: (day.schedule || []).map(s => ({
              time: s.time,
              title: s.title,
              type: s.badges?.includes('ETTEREM') ? 'food' : 'sight',
              note: s.desc,
            })),
          },
          people: trip.people || '',
          model: trip.aiModel || 'gemini-3.1-flash-lite',
        }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setExpandError('AI limit elerve. Probald ujra kesobb.')
        return
      }
      if (!res.ok) {
        setExpandError(data.error || 'Hiba tortent.')
        return
      }

      const expandedDay = { ...data.day, _draft: false }
      const updatedDays = trip.days.map(d =>
        d.dayNum === dayNum ? { ...d, ...expandedDay } : d
      )
      const updatedExpandedDays = [...expandedDays, dayNum]
      const allExpanded = updatedExpandedDays.length >= trip.days.length
      const updatedTripData = {
        ...trip,
        days: updatedDays,
        expandedDays: updatedExpandedDays,
        status: allExpanded ? 'complete' : 'draft',
      }

      await supabase
        .from('trips')
        .update({ trip_data: updatedTripData })
        .eq('slug', slug)

      await refetch()
    } catch {
      setExpandError('Nem sikerult elerni a szervert.')
    } finally {
      setExpandingDay(null)
    }
  }

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
      {isDraft && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center">
          <p className="text-sm text-amber-800 font-medium">
            Vazlat — a napokat egyenkent reszletezheted az AI-jal
          </p>
        </div>
      )}

      <TripOverview trip={trip} />

      {expandError && (
        <div className="max-w-3xl mx-auto px-4 md:px-10 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {expandError}
          </div>
        </div>
      )}

      <div>
        {(trip.days || []).map(day => (
          <div key={day.dayNum}>
            <DaySection day={day} />
            {isDraft && day._draft && !expandedDays.includes(day.dayNum) && (
              <div className="flex justify-center py-2 -mt-1">
                <button
                  onClick={() => handleExpandDay(day.dayNum)}
                  disabled={expandingDay !== null}
                  className="inline-flex items-center gap-2 bg-[#0f3460] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1a1a2e] transition-colors disabled:opacity-50"
                >
                  {expandingDay === day.dayNum ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Reszletezem...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      Reszletezd ezt a napot
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
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
