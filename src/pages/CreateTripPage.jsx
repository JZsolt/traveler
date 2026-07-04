import { useState, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAdmin } from '@/hooks/useAdmin'
import { Upload, Send, Sparkles, Save, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AI_MODEL_OPTIONS, DEFAULT_AI_MODEL } from '@/lib/constants'
import { useTrips } from '@/context/TripsContext'
import { formatDateRange } from '@/lib/dateUtils'
import { validateTripJson } from '@/lib/validateTripJson'
import { friendlyError } from '@/lib/friendlyError'
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug'
import { toSlug, DETAIL_OPTIONS } from '@/lib/createTripHelpers'
import { useCreateTripChat } from '@/hooks/useCreateTripChat'

export function CreateTripPage() {
  const { isAdminUnlocked } = useAdmin()
  const navigate = useNavigate()
  const { refetch } = useTrips()
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)
  const [step, setStep] = useState('form')
  const [importSaving, setImportSaving] = useState(false)
  const [error, setError] = useState(null)
  const [detailLevel, setDetailLevel] = useState('quick')
  const [aiModel, setAiModel] = useState(DEFAULT_AI_MODEL)
  const [generationPrompt, setGenerationPrompt] = useState('')
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    people: '',
  })

  const chat = useCreateTripChat({ form, aiModel, refetch, chatEndRef })

  if (!isAdminUnlocked) return <Navigate to="/settings" replace />

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
        setImportSaving(true)
        const baseSlug = normalizedTrip.slug || toSlug(normalizedTrip.title)
        const slug = await ensureUniqueSlug(baseSlug)
        const { error: insertError } = await supabase
          .from('trips')
          .insert({ slug, trip_data: { ...normalizedTrip, slug }, owner: null })
        if (insertError) {
          setError(friendlyError(insertError))
          setImportSaving(false)
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
    chat.startChat([{ role: 'user', content: parts.join('\n') }])
    setStep('chat')
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
                <input type="text" required value={form.destination} onChange={e => update('destination', e.target.value)} placeholder="pl. Roma, Praga, Horvatorszag" className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kezdes *</label>
                  <input type="date" required value={form.startDate} onChange={e => update('startDate', e.target.value)} className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Veges *</label>
                  <input type="date" required value={form.endDate} onChange={e => update('endDate', e.target.value)} className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utazok</label>
                <input type="text" value={form.people} onChange={e => update('people', e.target.value)} placeholder="pl. 4 felnott · 2 hazaspar" className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI modell</label>
                  <div className="flex flex-col gap-1.5">
                    {AI_MODEL_OPTIONS.map(opt => (
                      <button key={opt.value} type="button" onClick={() => setAiModel(opt.value)} className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border text-left ${aiModel === opt.value ? 'bg-[#0f3460] text-white border-[#0f3460]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        <span className="block">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 ${aiModel === opt.value ? 'text-white/70' : 'text-gray-400'}`}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reszletesseg</label>
                  <div className="flex flex-col gap-1.5">
                    {DETAIL_OPTIONS.map(opt => (
                      <button key={opt.value} type="button" onClick={() => setDetailLevel(opt.value)} className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border text-left ${detailLevel === opt.value ? 'bg-[#0f3460] text-white border-[#0f3460]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        <span className="block">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 ${detailLevel === opt.value ? 'text-white/70' : 'text-gray-400'}`}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
              )}

              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-[#e94560] text-white font-semibold py-3 rounded-xl hover:bg-[#d63d56] transition-colors text-base">
                <Sparkles className="w-4 h-4" />
                Tervezes inditasa
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={importSaving} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50">
                <Upload className="w-4 h-4" />
                {importSaving ? 'Importalas...' : 'Import JSON'}
              </button>
            </div>
          </>
        )}

        {step === 'chat' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button type="button" onClick={() => { setStep('form'); chat.reset() }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">{form.destination}</h1>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">AI modell</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AI_MODEL_OPTIONS.map(opt => (
                        <button key={opt.value} type="button" onClick={() => setAiModel(opt.value)} disabled={chat.generating || chat.chatLoading} className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border text-left disabled:opacity-50 ${aiModel === opt.value ? 'bg-[#0f3460] text-white border-[#0f3460]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                          <span className="block">{opt.label}</span>
                          <span className={`block text-[10px] mt-0.5 ${aiModel === opt.value ? 'text-white/70' : 'text-gray-400'}`}>{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Részletesség</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {DETAIL_OPTIONS.map(opt => (
                        <button key={opt.value} type="button" onClick={() => setDetailLevel(opt.value)} disabled={chat.generating || chat.chatLoading} className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border text-left disabled:opacity-50 ${detailLevel === opt.value ? 'bg-[#0f3460] text-white border-[#0f3460]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                          <span className="block">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Generálási instrukció</label>
                  <textarea value={generationPrompt} onChange={e => setGenerationPrompt(e.target.value)} rows={3} placeholder="pl. Cseréld a múzeumokat gyerekbarát programokra, legyen több gasztro és kevesebb séta." disabled={chat.generating || chat.chatLoading} className="w-full resize-y rounded-xl border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460] disabled:opacity-50" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 space-y-3 max-h-[60vh] overflow-y-auto">
                {chat.messages.slice(1).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#0f3460] text-white rounded-br-md' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {(chat.chatLoading || chat.generating) && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-400 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm animate-pulse">
                      {chat.generating ? 'Terv generalasa...' : 'Gondolkodom...'}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-2">
                <input type="text" value={chat.chatInput} onChange={e => chat.setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), chat.sendMessage())} placeholder="Kerdezz, pontosits..." disabled={chat.generating || chat.chatLoading} className="flex-1 min-w-0 rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460] disabled:opacity-50" />
                <button type="button" onClick={chat.sendMessage} disabled={!chat.chatInput.trim() || chat.generating || chat.chatLoading} className="bg-[#0f3460] text-white p-3 rounded-xl hover:bg-[#1a1a2e] transition-colors disabled:opacity-50 shrink-0">
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <button type="button" onClick={() => chat.generate(detailLevel, generationPrompt)} disabled={chat.generating || chat.chatLoading} className="w-full inline-flex items-center justify-center gap-2 bg-[#e94560] text-white font-semibold py-3 rounded-xl hover:bg-[#d63d56] transition-colors disabled:opacity-50">
                <Sparkles className="w-4 h-4" />
                {chat.generating ? 'Generalas...' : chat.generatedTrip ? 'Terv ujrageneralasa' : 'Terv generalasa'}
              </button>

              {chat.aiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {chat.aiError}
                  {chat.is429 && (
                    <button type="button" onClick={() => chat.generate('quick', generationPrompt)} className="mt-2 w-full bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 rounded-lg transition-colors text-xs">
                      Probald ujra gyors modban
                    </button>
                  )}
                </div>
              )}

              {chat.generatedTrip && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Vazlat</p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-[#1a1a2e]">{chat.generatedTrip.emoji} {chat.generatedTrip.title}</p>
                    <p className="text-sm text-[#0f3460] font-medium">{formatDateRange(chat.generatedTrip.startDate || form.startDate, chat.generatedTrip.endDate || form.endDate)}</p>
                    {(chat.generatedTrip.people || form.people) && <p className="text-xs text-gray-500">{chat.generatedTrip.people || form.people}</p>}
                  </div>

                  <div className="space-y-2 pt-2">
                    {(chat.generatedTrip.days || []).map((d, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-[#1a1a2e]">{d.day}. nap — {d.title}</p>
                        {d.summary && <p className="text-xs text-gray-500 mt-0.5">{d.summary}</p>}
                        <div className="mt-2 space-y-1">
                          {(d.items || []).map((item, j) => (
                            <p key={j} className="text-xs text-gray-600">
                              <span className="text-gray-400">{item.time || '--:--'}</span>{' '}
                              <span className="font-medium">{item.title}</span>
                              {item.note && <span className="text-gray-400"> — {item.note}</span>}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {chat.generatedTrip.tips?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-gray-400 mb-1">Tippek</p>
                      {chat.generatedTrip.tips.map((t, i) => <p key={i} className="text-xs text-gray-600">- {t}</p>)}
                    </div>
                  )}

                  <button type="button" onClick={chat.saveTrip} disabled={chat.saving} className="w-full inline-flex items-center justify-center gap-2 bg-[#0f3460] text-white font-semibold py-3 rounded-xl hover:bg-[#1a1a2e] transition-colors disabled:opacity-50 mt-2">
                    <Save className="w-4 h-4" />
                    {chat.saving ? 'Mentes...' : 'Vazlat mentese'}
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">A mentett utazasban egyenkent reszletezheted a napokat.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
