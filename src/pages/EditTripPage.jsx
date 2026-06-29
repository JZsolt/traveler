import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useTrips } from '@/context/TripsContext'
import { formatDateRange } from '@/lib/dateUtils'
import { friendlyError } from '@/lib/friendlyError'

function toSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function EditTripPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { trips, loading: tripsLoading, refetch } = useTrips()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(null)

  const trip = trips.find(t => t.slug === slug)

  useEffect(() => {
    if (trip && !form) {
      setForm({
        title: trip.title || '',
        startDate: trip.startDate || '',
        endDate: trip.endDate || '',
        emoji: trip.emoji || '',
        people: trip.people || '',
      })
    }
  }, [trip, form])

  if (tripsLoading) return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="text-center py-20 text-gray-400">
        <p className="text-2xl mb-2 animate-pulse">✈️</p>
        <p className="text-sm">Betoltes...</p>
      </div>
    </main>
  )

  if (!trip) return <Navigate to="/" replace />
  if (!form) return null

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const newSlug = toSlug(form.title)
    if (!newSlug) {
      setError('A cim nem generalt ervenyes slug-ot.')
      setSaving(false)
      return
    }

    const updatedTripData = {
      ...trip,
      slug: newSlug,
      title: form.title,
      subtitle: formatDateRange(form.startDate, form.endDate),
      startDate: form.startDate,
      endDate: form.endDate,
      emoji: form.emoji,
      people: form.people,
    }

    const { error: updateError } = await supabase
      .from('trips')
      .update({ slug: newSlug, trip_data: updatedTripData })
      .eq('slug', slug)

    if (updateError) {
      setError(friendlyError(updateError))
      setSaving(false)
      return
    }

    await refetch()
    navigate(`/trip/${newSlug}`)
  }

  return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Utazas szerkesztese</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cim *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kezdés *</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={e => update('startDate', e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vége *</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={e => update('endDate', e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
            <input
              type="text"
              value={form.emoji}
              onChange={e => update('emoji', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Utazok</label>
            <input
              type="text"
              value={form.people}
              onChange={e => update('people', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || deleting}
            className="w-full bg-[#0f3460] text-white font-semibold py-3 rounded-xl hover:bg-[#1a1a2e] transition-colors disabled:opacity-50 text-base"
          >
            {saving ? 'Mentes...' : 'Valtozasok mentese'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={saving || deleting}
              className="w-full bg-white text-red-600 border border-red-300 font-semibold py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Utazas torlese
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <p className="text-sm text-red-800 font-medium">
                Biztosan torolni akarod ezt az utazast? Ez a muvelet vegleges es nem vonhato vissza.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    setDeleting(true)
                    setError(null)
                    const { error: deleteError } = await supabase
                      .from('trips')
                      .delete()
                      .eq('slug', slug)
                    if (deleteError) {
                      setError(friendlyError(deleteError))
                      setDeleting(false)
                      return
                    }
                    await refetch()
                    navigate('/')
                  }}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Torles...' : 'Igen, torold'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="flex-1 bg-white text-gray-700 border border-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Megse
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
