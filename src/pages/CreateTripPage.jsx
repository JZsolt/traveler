import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Send, Sparkles, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useTrips } from '@/context/TripsContext'
import { formatDateRange } from '@/lib/dateUtils'
import { validateTripJson } from '@/lib/validateTripJson'

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
  const chatEndRef = useRef(null)
  const [tab, setTab] = useState('manual')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [importedData, setImportedData] = useState(null)
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    emoji: '',
    people: '',
  })

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Szia! Tervezz velem utazast. Ird le hova szeretnel menni, mikor, hany fore, es milyen programokat szeretnel — en osszeallitom a reszletes tervet!' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedTrip, setGeneratedTrip] = useState(null)
  const [aiError, setAiError] = useState(null)

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
        const { valid, errors, normalizedTrip } = validateTripJson(data)
        if (!valid) {
          setError(errors.join(' '))
          return
        }
        setImportedData(normalizedTrip)
        setForm({
          title: normalizedTrip.title || '',
          startDate: normalizedTrip.startDate || '',
          endDate: normalizedTrip.endDate || '',
          emoji: normalizedTrip.emoji || '',
          people: normalizedTrip.people || '',
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
      subtitle: formatDateRange(form.startDate, form.endDate),
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

  async function handleSendMessage() {
    const text = chatInput.trim()
    if (!text || generating || chatLoading) return
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setChatInput('')
    setAiError(null)
    setChatLoading(true)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAiError(data.error || 'Hiba tortent a valasz generalasa kozben.')
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setAiError('Nem sikerult elerni a szervert.')
    } finally {
      setChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  async function handleGenerate() {
    if (generating) return
    setGenerating(true)
    setAiError(null)
    setGeneratedTrip(null)

    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.filter(m => m.role === 'user') }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAiError(data.error || 'Ismeretlen hiba tortent.')
        return
      }

      setGeneratedTrip(data.trip)
      setMessages(prev => [...prev, { role: 'assistant', content: `Kesz a terv: ${data.trip.title} (${data.trip.days?.length || 0} nap, ${data.trip.highlights?.length || 0} highlight). Nezd at lent az elonezetet, es ha tetszik, mentsd el!` }])
    } catch {
      setAiError('Nem sikerult elerni a szervert.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSaveAiTrip() {
    if (!generatedTrip || saving) return
    setSaving(true)
    setAiError(null)

    const slug = generatedTrip.slug || toSlug(generatedTrip.title)
    if (!slug) {
      setAiError('A generalt trip-nek nincs ervenyes slug-ja.')
      setSaving(false)
      return
    }

    const tripData = { ...generatedTrip, slug }

    const { error: insertError } = await supabase
      .from('trips')
      .insert({ slug, trip_data: tripData, owner: null })

    if (insertError) {
      setAiError(insertError.message)
      setSaving(false)
      return
    }

    await refetch()
    navigate(`/trip/${slug}`)
  }

  const tabClass = (t) =>
    `flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
      tab === t
        ? 'bg-[#0f3460] text-white shadow-md'
        : 'bg-transparent text-gray-500 hover:text-gray-700'
    }`

  return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Uj utazas</h1>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button type="button" onClick={() => setTab('manual')} className={tabClass('manual')}>
            Kezi
          </button>
          <button type="button" onClick={() => setTab('ai')} className={tabClass('ai')}>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI tervezo
            </span>
          </button>
        </div>

        {tab === 'manual' && (
          <>
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
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
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
          </>
        )}

        {tab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 max-h-80 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#0f3460] text-white rounded-br-md'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {(chatLoading || generating) && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-400 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm animate-pulse">
                    {generating ? 'Terv generalasa...' : 'Gondolkodom...'}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="pl. 3 napos roma, 2 felnott, kultura + gasztro..."
                disabled={generating || chatLoading}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || generating || chatLoading}
                className="bg-[#0f3460] text-white p-2.5 rounded-lg hover:bg-[#1a1a2e] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={messages.filter(m => m.role === 'user').length === 0 || generating}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#e94560] text-white font-semibold py-2.5 rounded-lg hover:bg-[#d63d56] transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generalas...' : 'Terv generalasa'}
            </button>

            {aiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {aiError}
              </div>
            )}

            {generatedTrip && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Elonezet</p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-[#1a1a2e]">
                    {generatedTrip.emoji} {generatedTrip.title}
                  </p>
                  <p className="text-sm text-[#0f3460] font-medium">{generatedTrip.subtitle}</p>
                  <p className="text-xs text-gray-500">
                    {generatedTrip.startDate} — {generatedTrip.endDate}
                  </p>
                  <p className="text-xs text-gray-500">{generatedTrip.people}</p>
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{generatedTrip.days?.length || 0} nap</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{generatedTrip.highlights?.length || 0} highlight</span>
                </div>
                {generatedTrip.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {generatedTrip.highlights.map((h, i) => (
                      <span key={i} className="bg-slate-100 text-[#0f3460] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSaveAiTrip}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0f3460] text-white font-semibold py-2.5 rounded-lg hover:bg-[#1a1a2e] transition-colors disabled:opacity-50 mt-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Mentes...' : 'Utazas mentese'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
