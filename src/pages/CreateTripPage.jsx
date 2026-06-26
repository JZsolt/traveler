import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useTrips } from '@/context/TripsContext'

function toSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function CreateTripPage() {
  const navigate = useNavigate()
  const { refetch } = useTrips()
  const fileInputRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [importedData, setImportedData] = useState(null)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
    emoji: '',
    people: '',
  })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result)
        if (!data.slug && !data.title) {
          setError('Ervenytelen trip JSON — nincs slug vagy title mezo.')
          return
        }
        setImportedData(data)
        setForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          emoji: data.emoji || '',
          people: data.people || '',
        })
        setError(null)
      } catch {
        setError('Ervenytelen JSON fajl.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const slug = toSlug(form.title)
    if (!slug) {
      setError('A cim nem generalt ervenyes slug-ot.')
      setSaving(false)
      return
    }

    const tripData = {
      ...(importedData || {}),
      slug,
      title: form.title,
      subtitle: form.subtitle,
      startDate: form.startDate,
      endDate: form.endDate,
      emoji: form.emoji,
      people: form.people,
      highlights: importedData?.highlights || [],
      accommodation: importedData?.accommodation || { address: '', mapUrl: '' },
      flight: importedData?.flight || { airport: '', arrival: '', departure: '' },
      budget: importedData?.budget || { headline: '' },
      days: importedData?.days || [],
      overview: importedData?.overview || [],
      urgentBookings: importedData?.urgentBookings || [],
      usefulLinks: importedData?.usefulLinks || [],
      packingList: importedData?.packingList || [],
      savingTips: importedData?.savingTips || [],
      practicalInfo: importedData?.practicalInfo || [],
      bookingChecklist: importedData?.bookingChecklist || [],
    }

    const { error: insertError } = await supabase
      .from('trips')
      .insert({ slug, trip_data: tripData, owner: null })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    await refetch()
    navigate(`/trip/${slug}`)
  }

  return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Uj utazas</h1>

        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Import JSON
          </button>
          {importedData && (
            <span className="ml-3 text-xs text-green-600 font-medium">JSON betoltve</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cim *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="pl. Roma · Vatikan"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alcim</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={e => update('subtitle', e.target.value)}
              placeholder="pl. 2026. jul. 15-20."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kezdes *</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={e => update('startDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Veges *</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={e => update('endDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
            <input
              type="text"
              value={form.emoji}
              onChange={e => update('emoji', e.target.value)}
              placeholder="pl. 🇮🇹 🏛"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Utazok</label>
            <input
              type="text"
              value={form.people}
              onChange={e => update('people', e.target.value)}
              placeholder="pl. 4 felnott · 2 hazaspar"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#0f3460] text-white font-semibold py-2.5 rounded-lg hover:bg-[#1a1a2e] transition-colors disabled:opacity-50"
          >
            {saving ? 'Mentes...' : 'Utazas letrehozasa'}
          </button>
        </form>
      </div>
    </main>
  )
}
