import { useState, useRef } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { SquarePen, Trash2, Download, Wand2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useTrips } from '@/context/TripsContext'
import { friendlyError } from '@/lib/friendlyError'
import { addDay } from '@/lib/tripSections'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { DbError } from '@/components/DbError'
import { DaySection } from '@/components/DaySection'
import { BookingChecklist } from '@/components/trip/BookingChecklist'
import { PackingList } from '@/components/trip/PackingList'
import { PracticalInfo } from '@/components/trip/PracticalInfo'
import { SavingTips } from '@/components/trip/SavingTips'
import { TripHero } from '@/components/trip/TripHero'
import { TripOverview } from '@/components/trip/TripOverview'
import { UsefulLinks } from '@/components/trip/UsefulLinks'

const AI_MODEL_OPTIONS = [
  { value: 'gemini-3.1-flash-lite', label: '3.1 Flash Lite' },
  { value: 'gemini-2.5-flash', label: '2.5 Flash' },
]

export function TripPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { trips, loading, error, refetch } = useTrips()
  const trip = !loading && !error ? trips.find(t => t.slug === slug) : null
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [expandingDay, setExpandingDay] = useState(null)
  const heroRef = useRef(null)
  const [expandError, setExpandError] = useState(null)
  const [expandPrompts, setExpandPrompts] = useState({})
  const [expandModels, setExpandModels] = useState({})
  const { saveTrip: saveTripDays, saving: savingDays } = useTripUpdater({ trip, slug, refetch })

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
          model: expandModels[dayNum] || trip.aiModel || 'gemini-3.1-flash-lite',
          instruction: expandPrompts[dayNum] || '',
        }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setExpandError(friendlyError(data.error || '429'))
        return
      }
      if (!res.ok) {
        setExpandError(friendlyError(data.error))
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
    } catch (err) {
      setExpandError(friendlyError(err))
    } finally {
      setExpandingDay(null)
    }
  }

  return (
    <main className="pb-16" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="relative">
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={() => heroRef.current?.edit()}
            aria-label="Utazás szerkesztése"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <SquarePen className="w-4 h-4" />
          </button>
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
            aria-label="JSON exportálás"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            aria-label="Utazás törlése"
            className="bg-white/20 hover:bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <TripHero trip={trip} slug={slug} refetch={refetch} editRef={heroRef} />
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
                    setDeleteError(friendlyError(err))
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

      <TripOverview trip={trip} slug={slug} refetch={refetch} />

      {expandError && (
        <div className="max-w-3xl mx-auto px-4 md:px-10 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {expandError}
          </div>
        </div>
      )}

      <div>
        {(trip.days || []).map((day, idx) => (
          <div key={day.dayNum}>
            <DaySection day={day} trip={trip} slug={slug} refetch={refetch} isFirst={idx === 0} isLast={idx === (trip.days || []).length - 1} />
            {isDraft && day._draft && !expandedDays.includes(day.dayNum) && (
              <div className="max-w-3xl mx-auto px-4 md:px-10 py-3 -mt-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {AI_MODEL_OPTIONS.map(opt => {
                      const selectedModel = expandModels[day.dayNum] || trip.aiModel || 'gemini-3.1-flash-lite'
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setExpandModels(prev => ({ ...prev, [day.dayNum]: opt.value }))}
                          disabled={expandingDay !== null}
                          className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors disabled:opacity-50 ${
                            selectedModel === opt.value
                              ? 'border-[#0f3460] bg-[#0f3460] text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  <textarea
                    value={expandPrompts[day.dayNum] || ''}
                    onChange={e => setExpandPrompts(prev => ({ ...prev, [day.dayNum]: e.target.value }))}
                    rows={2}
                    placeholder="Extra instrukció ehhez a naphoz: pl. több gyerekbarát program, jobb éttermek, kevesebb séta..."
                    disabled={expandingDay !== null}
                    className="w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460] disabled:opacity-50"
                  />
                <button
                  onClick={() => handleExpandDay(day.dayNum)}
                  disabled={expandingDay !== null}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0f3460] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1a1a2e] disabled:opacity-50"
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
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-center py-3">
          <button
            onClick={() => saveTripDays(t => addDay(t))}
            disabled={savingDays}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#0f3460] hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Új nap
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-10 py-6 space-y-6">
        <SavingTips tips={trip.savingTips || []} label={trip.savingTipsLabel} trip={trip} slug={slug} refetch={refetch} />
        <PracticalInfo sections={trip.practicalInfo || []} trip={trip} slug={slug} refetch={refetch} />
        <BookingChecklist items={trip.bookingChecklist || []} trip={trip} slug={slug} refetch={refetch} />
        <UsefulLinks links={trip.usefulLinks || []} trip={trip} slug={slug} refetch={refetch} />
        <PackingList items={trip.packingList || []} trip={trip} slug={slug} refetch={refetch} />

        <p className="text-center text-[10px] text-gray-400 pt-6">
          Jó utat és sok szép élményt! 🧳✨ {trip.emoji}
        </p>
      </div>
    </main>
  )
}
