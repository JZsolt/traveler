import { useState } from 'react'
import { ChevronDown, X, Ticket, SquarePen } from 'lucide-react'
import { ScheduleItem } from './ScheduleItem'
import { CostTable } from './CostTable'
import { AlertBox } from './AlertBox'
import { TransportOptions } from './TransportOptions'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { useAdmin } from '@/hooks/useAdmin'
import { useDayMetaEditor } from '@/hooks/useDayMetaEditor'
import { useDayAdvancedEditor } from '@/hooks/useDayAdvancedEditor'
import { useDayScheduleAi } from '@/hooks/useDayScheduleAi'
import { updateTripDay, moveDayUp, moveDayDown, deleteDay, addScheduleItem, deleteScheduleItem, moveScheduleItem, updateScheduleItem } from '@/lib/tripSections'
import { Button } from '@/components/ui/button'
import { DirtyCancelRow } from '@/components/editor/DirtyCancelRow'

export function DaySection({ day, trip, slug, refetch, isFirst, isLast }) {
  const { isAdminUnlocked } = useAdmin()
  const [open, setOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const meta = useDayMetaEditor({ day, saveTrip, updateTripDay })
  const advanced = useDayAdvancedEditor({ day, saveTrip, updateTripDay })
  const scheduleAi = useDayScheduleAi({ day, trip, saveTrip, updateTripDay })

  const activeSchedule = scheduleAi.pendingDraft?.schedule || day.schedule || []

  return (
    <div className="border-b border-slate-200/60">
      <div className="group/day">
        <div
          role="button"
          tabIndex={0}
          onClick={() => !meta.editing && setOpen(!open)}
          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !meta.editing) { e.preventDefault(); setOpen(!open) } }}
          className="w-full cursor-pointer"
        >
          <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white p-4 md:p-5 rounded-2xl mx-3 md:mx-8 my-2.5 flex items-center gap-4 hover:opacity-95 transition-opacity active:scale-[0.99] relative">
            <div className="bg-[#e94560] w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-xl font-extrabold shrink-0">
              {day.dayNum}
            </div>
            {meta.editing ? (
              <div className="flex-1 text-left space-y-1.5" onClick={e => e.stopPropagation()}>
                <input type="text" value={meta.draft.title} onChange={e => meta.setDraft({ ...meta.draft, title: e.target.value })} placeholder="Nap címe" className="w-full border border-white/30 bg-white/10 rounded-lg px-2 py-1 text-[15px] md:text-lg font-bold text-white placeholder:text-white/40" />
                <input type="text" value={meta.draft.subtitle} onChange={e => meta.setDraft({ ...meta.draft, subtitle: e.target.value })} placeholder="Alcím" className="w-full border border-white/30 bg-white/10 rounded-lg px-2 py-1 text-[11px] md:text-xs text-white placeholder:text-white/40" />
                {error && <p className="text-[10px] text-red-300">{error}</p>}
                <div className="flex gap-2">
                  <Button onClick={meta.save} disabled={saving} size="sm" className="bg-[#e94560] hover:bg-[#d63d56] text-white text-xs h-7">
                    {saving ? 'Mentés...' : 'Mentés'}
                  </Button>
                  {meta.confirmCancel ? (
                    <DirtyCancelRow show onDiscard={meta.cancel} onDismiss={e => { e?.stopPropagation(); meta.setConfirmCancel(false) }} dark />
                  ) : (
                    <Button onClick={meta.cancel} disabled={saving} variant="ghost" size="sm" className="border border-white/30 text-white hover:bg-white/10 text-xs h-7">
                      Mégse
                    </Button>
                  )}
                  <Button onClick={e => { e.stopPropagation(); meta.toggleAi() }} variant="ghost" size="sm" className="border border-purple-400/50 text-purple-200 hover:bg-purple-500/20 text-xs h-7 sm:ml-auto">
                    AI javaslat
                  </Button>
                </div>
                {meta.showAi && (
                  <div onClick={e => e.stopPropagation()}>
                    <AiSuggestionPanel
                      section="day"
                      trip={trip}
                      extraBody={{ dayNum: day.dayNum }}
                      onApply={s => meta.setDraft({ title: s.title, subtitle: s.subtitle })}
                      renderPreview={s => (
                        <div className="text-xs text-slate-700 space-y-0.5">
                          <p><strong>Cím:</strong> {s.title}</p>
                          <p><strong>Alcím:</strong> {s.subtitle}</p>
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 text-left">
                <h2 className="text-[15px] md:text-lg font-bold leading-tight">{day.title}</h2>
                <p className="text-[11px] md:text-xs opacity-60 mt-0.5">{day.subtitle}</p>
              </div>
            )}
            {!meta.editing && (
              <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover/day:opacity-100 focus-within:opacity-100 transition-opacity">
                {isAdminUnlocked && !scheduleAi.pendingDraft && <>
                  <button onClick={meta.startEdit} aria-label="Nap szerkesztése" className="text-white/40 hover:text-white p-1.5 rounded-full hover:bg-white/10">
                    <SquarePen className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); saveTrip(t => moveDayUp(t, day.dayNum)) }} disabled={isFirst || saving} aria-label="Nap fel" className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 disabled:opacity-20">
                    <span className="text-[10px]">▲</span>
                  </button>
                  <button onClick={e => { e.stopPropagation(); saveTrip(t => moveDayDown(t, day.dayNum)) }} disabled={isLast || saving} aria-label="Nap le" className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 disabled:opacity-20">
                    <span className="text-[10px]">▼</span>
                  </button>
                  <button onClick={e => { e.stopPropagation(); setConfirmDelete(true) }} aria-label="Nap törlése" className="text-red-400/60 hover:text-red-400 p-1 rounded-full hover:bg-white/10">
                    <span className="text-[10px]">✕</span>
                  </button>
                </>}
                <ChevronDown className={`w-5 h-5 opacity-40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="mx-3 md:mx-8 mb-2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
          <p className="text-xs text-red-700 flex-1">Biztosan törlöd a {day.dayNum}. napot?</p>
          <Button onClick={() => { saveTrip(t => deleteDay(t, day.dayNum)); setConfirmDelete(false) }} disabled={saving} size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs h-7">
            Törlés
          </Button>
          <Button onClick={() => setConfirmDelete(false)} variant="outline" size="sm" className="text-xs h-7">
            Mégse
          </Button>
        </div>
      )}

      {open && (
        <div className="px-4 md:px-12 pb-5">
          {day.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 md:gap-2.5 mt-3 mb-4">
              {day.images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-slate-200 cursor-pointer" onClick={() => setLightbox(img)}>
                  <img src={img.url} alt={img.caption} className="w-full h-24 md:h-36 object-cover hover:scale-105 transition-all duration-300" loading="lazy" decoding="async" fetchPriority={i === 0 ? 'high' : 'low'} onLoad={e => e.target.style.opacity = 1} style={{ opacity: 0, transition: 'opacity 0.3s' }} />
                  <p className="text-center text-[9px] md:text-[10px] text-slate-400 mt-1 px-1">{img.caption}</p>
                </div>
              ))}
            </div>
          )}

          {lightbox && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setLightbox(null)}>
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer z-10" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
                <X className="w-7 h-7" />
              </button>
              <img src={lightbox.url} alt={lightbox.caption} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              <p className="text-white/80 text-sm mt-3 text-center">{lightbox.caption}</p>
            </div>
          )}

          {day.tickets?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 mb-2">
              {day.tickets.map((t, i) => (
                <a key={i} href={t.pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-3.5 py-2.5 transition-colors no-underline">
                  <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-emerald-800">{t.label}</span>
                    <span className="block text-[10px] text-emerald-600/70">{t.desc}</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {day.alerts?.map((alert, i) => <AlertBox key={i} type={alert.type} text={alert.text} />)}

          {day.transportOptions && <TransportOptions data={day.transportOptions} />}

          <div>
            {scheduleAi.pendingDraft && (
              <div className="mb-3 border border-purple-200 bg-purple-50/50 rounded-xl p-3 space-y-2">
                <p className="text-xs font-medium text-purple-700">AI javaslat alkalmazva — még nincs mentve!</p>
                <div className="flex gap-2">
                  <Button onClick={scheduleAi.saveDraft} disabled={saving} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
                    {saving ? 'Mentés...' : 'Mentés'}
                  </Button>
                  <Button onClick={scheduleAi.discardDraft} variant="outline" size="sm" className="text-xs h-7">
                    Visszavonás
                  </Button>
                </div>
              </div>
            )}
            {activeSchedule.map((item, i) => (
              <ScheduleItem
                key={i}
                item={item}
                isFirst={i === 0}
                isLast={i === activeSchedule.length - 1}
                saving={saving}
                error={error}
                trip={trip}
                dayNum={day.dayNum}
                itemIndex={i}
                onSave={scheduleAi.pendingDraft ? undefined : (updates => saveTrip(t => updateScheduleItem(t, day.dayNum, i, updates)))}
                onMoveUp={scheduleAi.pendingDraft ? undefined : (() => saveTrip(t => moveScheduleItem(t, day.dayNum, i, -1)))}
                onMoveDown={scheduleAi.pendingDraft ? undefined : (() => saveTrip(t => moveScheduleItem(t, day.dayNum, i, 1)))}
                onDelete={scheduleAi.pendingDraft ? undefined : (() => saveTrip(t => deleteScheduleItem(t, day.dayNum, i)))}
                readOnly={!!scheduleAi.pendingDraft || !isAdminUnlocked}
              />
            ))}
            {isAdminUnlocked && (
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => saveTrip(t => addScheduleItem(t, day.dayNum))} disabled={saving || !!scheduleAi.pendingDraft} className="text-xs text-slate-400 hover:text-[#0f3460] hover:bg-slate-100 px-2 py-1 rounded-full transition-colors disabled:opacity-50">
                  + Új program
                </button>
                <button onClick={scheduleAi.togglePanel} disabled={!!scheduleAi.pendingDraft} className="text-xs text-purple-500 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded-full transition-colors disabled:opacity-50">
                  AI programterv
                </button>
              </div>
            )}
            {scheduleAi.showPanel && (
              <div className="mt-2 border border-purple-200 bg-purple-50/50 rounded-xl p-3 space-y-2">
                {scheduleAi.preview ? (
                  <>
                    <p className="text-xs font-medium text-purple-700">
                      Javasolt programterv ({scheduleAi.preview.schedule?.length || 0} program)
                    </p>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {(scheduleAi.preview.schedule || []).map((s, i) => (
                        <div key={i} className="text-xs text-slate-700 flex gap-2 py-0.5">
                          <span className="text-slate-400 tabular-nums w-10 shrink-0">{s.time}</span>
                          <span className="font-medium">{s.title}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={scheduleAi.applyPreview} className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
                        Alkalmazás
                      </Button>
                      <Button size="sm" variant="outline" onClick={scheduleAi.clearPreview} className="text-xs h-7">
                        Elvetés
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-medium text-purple-700">AI napi programterv generálás</p>
                    <input
                      type="text"
                      value={scheduleAi.instruction}
                      onChange={e => scheduleAi.setInstruction(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !scheduleAi.loading && scheduleAi.generate()}
                      placeholder="Opcionális instrukció (pl. 'több múzeum', 'laza tempó')..."
                      className="w-full border border-purple-200 rounded-lg px-2 py-1.5 text-sm"
                    />
                    {scheduleAi.error && <p className="text-xs text-red-600">{scheduleAi.error}</p>}
                    <Button size="sm" onClick={scheduleAi.generate} disabled={scheduleAi.loading} className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
                      {scheduleAi.loading ? 'Generálás...' : 'Programterv kérése'}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {isAdminUnlocked && <details className="mt-4 mb-2">
            <summary className="text-[11px] text-slate-400 cursor-pointer hover:text-slate-600">Haladó nap adatok</summary>
            {advanced.editing ? (
              <div className="mt-2 space-y-3">
                {advanced.fields.map(field => (
                  <div key={field}>
                    <label className="text-[10px] font-medium text-slate-500">{field}</label>
                    <textarea value={advanced.draft[field]} onChange={e => advanced.updateField(field, e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono resize-y" />
                    {advanced.errors[field] && <p className="text-[10px] text-red-500">{advanced.errors[field]}</p>}
                  </div>
                ))}
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-2">
                  <Button onClick={advanced.save} disabled={saving} size="sm" className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-xs h-7">
                    {saving ? 'Mentés...' : 'Mentés'}
                  </Button>
                  {advanced.confirmCancel ? (
                    <DirtyCancelRow show onDiscard={advanced.cancel} onDismiss={advanced.dismissCancel} />
                  ) : (
                    <Button onClick={advanced.cancel} variant="outline" size="sm" className="text-xs h-7">
                      Mégse
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <button onClick={advanced.startEdit} className="text-[11px] text-[#0f3460] hover:underline">
                  Szerkesztés
                </button>
              </div>
            )}
          </details>}

          {day.costs && <CostTable costs={day.costs} />}

          {day.endAlerts?.map((alert, i) => <AlertBox key={i} type={alert.type} text={alert.text} url={alert.url} />)}
        </div>
      )}
    </div>
  )
}
