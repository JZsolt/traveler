import { useState, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAdmin } from '@/hooks/useAdmin'
import { Upload, Sparkles } from 'lucide-react'
import { AI_MODEL_OPTIONS, DEFAULT_AI_MODEL } from '@/lib/constants'
import { useTrips } from '@/hooks/useTrips'
import { DETAIL_OPTIONS } from '@/lib/createTripHelpers'
import { useCreateTripChat } from '@/hooks/useCreateTripChat'
import { useImportTripJson } from '@/hooks/useImportTripJson'
import { CreateTripChatStep } from './CreateTripChatStep'
import type { CreateTripForm } from '@/types/createTrip'
import type { ChatMessage, DetailLevel } from '@/types/api'
import type { CreateTripStep } from '@/types/pages'

export function CreateTripPage() {
  const { isAdminUnlocked } = useAdmin()
  const navigate = useNavigate()
  const { refetch } = useTrips()
  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<CreateTripStep>('form')
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('quick')
  const [aiModel, setAiModel] = useState(DEFAULT_AI_MODEL)
  const [generationPrompt, setGenerationPrompt] = useState('')
  const [form, setForm] = useState<CreateTripForm>({
    destination: '',
    startDate: '',
    endDate: '',
    people: '',
  })

  const chat = useCreateTripChat({ form, aiModel, refetch, chatEndRef })
  const imp = useImportTripJson({ refetch, navigate })

  if (!isAdminUnlocked) return <Navigate to="/settings" replace />

  function update(field: keyof CreateTripForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleStartChat(e: React.FormEvent) {
    e.preventDefault()
    const parts: string[] = []
    parts.push(`Utazas celallomasa: ${form.destination}`)
    parts.push(`Idopont: ${form.startDate} - ${form.endDate}`)
    if (form.people) parts.push(`Utazok: ${form.people}`)
    const initialMessage: ChatMessage = { role: 'user', content: parts.join('\n') }
    chat.startChat([initialMessage])
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

              {imp.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{imp.error}</div>
              )}

              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-[#e94560] text-white font-semibold py-3 rounded-xl hover:bg-[#d63d56] transition-colors text-base">
                <Sparkles className="w-4 h-4" />
                Tervezes inditasa
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <input ref={fileInputRef} type="file" accept=".json" onChange={imp.handleImport} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imp.importing} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50">
                <Upload className="w-4 h-4" />
                {imp.importing ? 'Importalas...' : 'Import JSON'}
              </button>
            </div>
          </>
        )}

        {step === 'chat' && (
          <CreateTripChatStep
            form={form}
            chat={chat}
            chatEndRef={chatEndRef}
            aiModel={aiModel}
            setAiModel={setAiModel}
            detailLevel={detailLevel}
            setDetailLevel={setDetailLevel}
            generationPrompt={generationPrompt}
            setGenerationPrompt={setGenerationPrompt}
            onBack={() => { setStep('form'); chat.reset() }}
          />
        )}
      </div>
    </main>
  )
}
