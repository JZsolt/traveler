import { Send, Sparkles, Save, ArrowLeft } from 'lucide-react'
import { AI_MODEL_OPTIONS } from '@/lib/constants'
import { DETAIL_OPTIONS } from '@/lib/createTripHelpers'
import { formatDateRange } from '@/lib/dateUtils'
import type { CreateTripChatStepProps } from '@/types/pages'

export function CreateTripChatStep({ form, chat, chatEndRef, aiModel, setAiModel, detailLevel, setDetailLevel, generationPrompt, setGenerationPrompt, onBack }: CreateTripChatStepProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
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
          <input type="text" value={chat.chatInput} onChange={e => chat.setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chat.sendMessage() } }} placeholder="Kerdezz, pontosits..." disabled={chat.generating || chat.chatLoading} className="flex-1 min-w-0 rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460] disabled:opacity-50" />
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
              <p className="text-sm text-[#0f3460] font-medium">{formatDateRange(chat.generatedTrip.startDate || form.startDate, chat.generatedTrip.endDate || form.endDate || '')}</p>
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

            {chat.generatedTrip.tips && chat.generatedTrip.tips.length > 0 && (
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
  )
}
