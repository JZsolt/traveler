import { ChevronDown, ChevronUp, SquarePen, X } from 'lucide-react'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { DirtyCancelRow } from '@/components/editor/DirtyCancelRow'
import { Button } from '@/components/ui/button'
import { isDayMetaSuggestion } from '@/types/guards'
import type { DayHeaderProps } from '@/types/components'
import type { DayMetaDraft } from '@/types/hooks'

export function DayHeader({
  day,
  trip,
  meta,
  saving,
  error,
  isAdminUnlocked,
  isFirst,
  isLast,
  hasPendingScheduleDraft,
  open,
  onToggleOpen,
  onMoveUp,
  onMoveDown,
  onDeleteRequest,
}: DayHeaderProps) {
  return (
    <div className="group/day">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !meta.editing && onToggleOpen()}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ' ') && !meta.editing) {
            e.preventDefault()
            onToggleOpen()
          }
        }}
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
              {isAdminUnlocked && !hasPendingScheduleDraft && <>
                <button onClick={meta.startEdit} aria-label="Nap szerkesztése" className="text-white/40 hover:text-white p-1.5 rounded-full hover:bg-white/10">
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
                <button onClick={e => { e.stopPropagation(); onMoveUp() }} disabled={isFirst || saving} aria-label="Nap fel" className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 disabled:opacity-20">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button onClick={e => { e.stopPropagation(); onMoveDown() }} disabled={isLast || saving} aria-label="Nap le" className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 disabled:opacity-20">
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button onClick={e => { e.stopPropagation(); onDeleteRequest() }} aria-label="Nap törlése" className="text-red-400/60 hover:text-red-400 p-1 rounded-full hover:bg-white/10">
                  <X className="w-3 h-3" />
                </button>
              </>}
              <ChevronDown className={`w-5 h-5 opacity-40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
