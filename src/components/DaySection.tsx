import { useState } from 'react'
import { ChevronDown, SquarePen } from 'lucide-react'
import { ScheduleItem } from './ScheduleItem'
import { CostTable } from './CostTable'
import { AlertBox } from './AlertBox'
import { TransportOptions } from './TransportOptions'
import { DayImages } from './day/DayImages'
import { DayTickets } from './day/DayTickets'
import { DayDeleteConfirm } from './day/DayDeleteConfirm'
import { DayScheduleActions } from './day/DayScheduleActions'
import { DayScheduleAiPanel } from './day/DayScheduleAiPanel'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { useAdmin } from '@/hooks/useAdmin'
import { useDayMetaEditor } from '@/hooks/useDayMetaEditor'
import { useDayAdvancedEditor } from '@/hooks/useDayAdvancedEditor'
import { useDayScheduleAi } from '@/hooks/useDayScheduleAi'
import { updateTripDay, moveDayUp, moveDayDown, deleteDay, addScheduleItem, deleteScheduleItem, moveScheduleItem, updateScheduleItem } from '@/lib/tripSections'
import { Button } from '@/components/ui/button'
import { DirtyCancelRow } from '@/components/editor/DirtyCancelRow'
import type { DaySectionProps } from '@/types/components'
import type { Image } from '@/types/trip'
import type { DayMetaDraft } from '@/types/hooks'

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null
}

function isDayMetaSuggestion(val: unknown): val is DayMetaDraft {
  if (!isRecord(val)) return false
  if (typeof val.title !== 'string') return false
  if (typeof val.subtitle !== 'string') return false
  return true
}

export function DaySection({ day, trip, slug, refetch, isFirst, isLast }: DaySectionProps) {
  const { isAdminUnlocked } = useAdmin()
  const [open, setOpen] = useState(false)
  const [lightbox, setLightbox] = useState<Image | null>(null)
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
            {meta.editing && meta.draft ? (
              <div className="flex-1 text-left space-y-1.5" onClick={e => e.stopPropagation()}>
                <input type="text" value={meta.draft.title} onChange={e => meta.setDraft({ ...meta.draft!, title: e.target.value })} placeholder="Nap címe" className="w-full border border-white/30 bg-white/10 rounded-lg px-2 py-1 text-[15px] md:text-lg font-bold text-white placeholder:text-white/40" />
                <input type="text" value={meta.draft.subtitle} onChange={e => meta.setDraft({ ...meta.draft!, subtitle: e.target.value })} placeholder="Alcím" className="w-full border border-white/30 bg-white/10 rounded-lg px-2 py-1 text-[11px] md:text-xs text-white placeholder:text-white/40" />
                {error && <p className="text-[10px] text-red-300">{error}</p>}
                <div className="flex gap-2">
                  <Button onClick={meta.save} disabled={saving} size="sm" className="bg-[#e94560] hover:bg-[#d63d56] text-white text-xs h-7">
                    {saving ? 'Mentés...' : 'Mentés'}
                  </Button>
                  {meta.confirmCancel ? (
                    <DirtyCancelRow show onDiscard={() => meta.cancel()} onDismiss={() => meta.setConfirmCancel(false)} dark />
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
                    <AiSuggestionPanel<DayMetaDraft>
                      section="day"
                      trip={trip}
                      extraBody={{ dayNum: day.dayNum }}
                      validateSuggestion={isDayMetaSuggestion}
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
        <DayDeleteConfirm
          dayNum={day.dayNum}
          saving={saving}
          onConfirm={() => { saveTrip(t => deleteDay(t, day.dayNum)); setConfirmDelete(false) }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {open && (
        <div className="px-4 md:px-12 pb-5">
          <DayImages images={day.images} lightbox={lightbox} onOpen={setLightbox} onClose={() => setLightbox(null)} />
          <DayTickets tickets={day.tickets} />

          {day.alerts?.map((alert, i) => <AlertBox key={i} type={alert.type} text={alert.text} />)}

          {day.transportOptions && <TransportOptions data={day.transportOptions} people={trip.people} />}

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
              <DayScheduleActions
                saving={saving}
                pending={!!scheduleAi.pendingDraft}
                onAdd={() => saveTrip(t => addScheduleItem(t, day.dayNum))}
                onAi={scheduleAi.togglePanel}
              />
            )}
            <DayScheduleAiPanel scheduleAi={scheduleAi} />
          </div>

          {isAdminUnlocked && <details className="mt-4 mb-2">
            <summary className="text-[11px] text-slate-400 cursor-pointer hover:text-slate-600">Haladó nap adatok</summary>
            {advanced.editing && advanced.draft ? (
              <div className="mt-2 space-y-3">
                {advanced.fields.map(field => (
                  <div key={field}>
                    <label className="text-[10px] font-medium text-slate-500">{field}</label>
                    <textarea value={advanced.draft![field]} onChange={e => advanced.updateField(field, e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono resize-y" />
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

          {day.costs && <CostTable costs={day.costs} people={trip.people} />}

          {day.endAlerts?.map((alert, i) => <AlertBox key={i} type={alert.type} text={alert.text} url={alert.url} />)}
        </div>
      )}
    </div>
  )
}
