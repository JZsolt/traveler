import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Send, Sparkles, Save, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useTrips } from '@/context/TripsContext'
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
  const [step, setStep] = useState('form')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    people: '',
  })

  const [messages, setMessages] = useState([])
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
    reader.onload = async (evt) => {
      try {
        const data = JSON.parse(evt.target.result)
        const { valid, errors, normalizedTrip } = validateTripJson(data)
        if (!valid) {
          setError(errors.join(' '))
          return
        }
        setError(null)
        setSaving(true)
        const slug = normalizedTrip.slug || toSlug(normalizedTrip.title)
        const { error: insertError } = await supabase
          .from('trips')
          .insert({ slug, trip_data: { ...normalizedTrip, slug }, owner: null })
        if (insertError) {
          setError(insertError.message)
          setSaving(false)
          return
        }
        await refetch()
        navigate(`/trip/${slug}`)
      } catch {
        setError('Ervenytelen JSON fajl.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleStartChat(e) {
    e.preventDefault()
    const parts = []
    parts.push(`Utazas celallomasa: ${form.destination}`)
    parts.push(`Idopont: ${form.startDate} - ${form.endDate}`)
    if (form.people) parts.push(`Utazok: ${form.people}`)

    const context = parts.join('\n')
    const initialMessages = [
      { role: 'user', content: context },
    ]
    setMessages(initialMessages)
    setStep('chat')
    setChatLoading(true)

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: initialMessages }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.reply) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        } else {
          setAiError(data.error || 'Hiba tortent.')
        }
      })
      .catch(() => setAiError('Nem sikerult elerni a szervert.'))
      .finally(() => {
        setChatLoading(false)
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
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
        setAiError(data.error || 'Hiba tortent.')
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
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAiError(data.error || 'Ismeretlen hiba tortent.')
        return
      }

      setGeneratedTrip(data.trip)
      setMessages(prev => [...prev, { role: 'assistant', content: `Kesz a terv: ${data.trip.title} (${data.trip.days?.length || 0} nap). Nezd at az elonezetet lent, es ha tetszik, mentsd el!` }])
    } catch {
      setAiError('Nem sikerult elerni a szervert.')
    } finally {
      setGenerating(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
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

  return (
    <main className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-lg mx-auto px-4 py-10">

        {step === 'form' && (
          <>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Uj utazas</h1>

            <form onSubmit={handleStartChat} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uti cel *</label>
                <input
                  type="text"
                  required
                  value={form.destination}
                  onChange={e => update('destination', e.target.value)}
                  placeholder="pl. Roma, Praga, Horvatorszag"
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
                className="w-full inline-flex items-center justify-center gap-2 bg-[#e94560] text-white font-semibold py-2.5 rounded-lg hover:bg-[#d63d56] transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Tervezes inditasa
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
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
                disabled={saving}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {saving ? 'Importalas...' : 'Import JSON'}
              </button>
            </div>
          </>
        )}

        {step === 'chat' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => { setStep('form'); setMessages([]); setGeneratedTrip(null); setAiError(null) }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">
                {form.destination}
              </h1>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 max-h-96 overflow-y-auto">
                {messages.slice(1).map((msg, i) => (
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
                  placeholder="Kerdezz, pontosits, kerj valtoztatast..."
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
                disabled={generating || chatLoading}
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
                    {generatedTrip.people && (
                      <p className="text-xs text-gray-500">{generatedTrip.people}</p>
                    )}
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
          </>
        )}
      </div>
    </main>
  )
}
