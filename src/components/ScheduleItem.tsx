import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { MapPin, Copy, Check, SquarePen } from 'lucide-react'
import { GuideInfo } from './GuideInfo'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { ScheduleEditor } from '@/components/editor/ScheduleEditor'
import { Button } from '@/components/ui/button'
import { DirtyCancelRow } from '@/components/editor/DirtyCancelRow'
import { extractLocationName } from '@/lib/extractLocationName'
import { useScheduleItemEditor } from '@/hooks/useScheduleItemEditor'
import type { ScheduleItemProps } from '@/types/components'
import type { Guide } from '@/types/trip'
import type { ScheduleItemDraft } from '@/types/hooks'

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null
}

function isGuide(val: unknown): val is Guide {
  if (!isRecord(val)) return false
  for (const key of ['history', 'mustSee', 'funFacts', 'tips'] as const) {
    if (val[key] !== undefined && !Array.isArray(val[key])) return false
  }
  return true
}

function isScheduleItemSuggestion(val: unknown): val is Partial<ScheduleItemDraft> {
  if (!isRecord(val)) return false
  if (val.title !== undefined && typeof val.title !== 'string') return false
  if (val.time !== undefined && typeof val.time !== 'string') return false
  return true
}

export function ScheduleItem({ item, onSave, saving, error, isFirst, isLast, onMoveUp, onMoveDown, onDelete, trip, dayNum, itemIndex, readOnly }: ScheduleItemProps) {
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const editor = useScheduleItemEditor({ item, onSave })

  const mapLink = item.links?.find(l => l.label.includes('Térkép') || l.label.includes('📍'))
  const otherLinks = item.links?.filter(l => l !== mapLink)
  const locationName = mapLink ? extractLocationName(mapLink.url) : null

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  if (editor.editing && !readOnly) {
    return (
      <div className="py-2 border-b border-slate-100/80">
        <ScheduleEditor draft={editor.draft!} onChange={(d) => editor.setDraft(d)} aiGuidePanel={
          trip && dayNum != null && itemIndex != null ? (
            <div>
              <label className="text-[10px] font-medium text-slate-500">AI guide javaslat</label>
              <AiSuggestionPanel<Guide>
                section="scheduleItemGuide"
                trip={trip}
                extraBody={{ dayNum, itemIndex }}
                validateSuggestion={isGuide}
                onApply={s => {
                  editor.setDraft(prev => prev ? ({
                    ...prev,
                    guide: {
                      ...prev.guide,
                      history: [...(prev.guide.history || []), ...(s.history || [])],
                      mustSee: [...(prev.guide.mustSee || []), ...(s.mustSee || [])],
                      funFacts: [...(prev.guide.funFacts || []), ...(s.funFacts || [])],
                      tips: [...(prev.guide.tips || []), ...(s.tips || [])],
                    },
                  }) : prev)
                }}
                renderPreview={s => (
                  <div className="space-y-1 text-xs text-slate-700">
                    {(['history', 'mustSee', 'funFacts', 'tips'] as const).map(key => (
                      s[key] && s[key].length > 0 && (
                        <div key={key}>
                          <p className="font-medium text-slate-500">{key}:</p>
                          {s[key]!.map((t, i) => <p key={i} className="ml-2"><span className="text-purple-400">+</span> {typeof t === 'string' ? t : String(t)}</p>)}
                        </div>
                      )
                    ))}
                  </div>
                )}
              />
            </div>
          ) : null
        } />
        {(editor.validationError || error) && <p className="text-xs text-red-600 mt-1">{editor.validationError || error}</p>}
        <div className="flex gap-2 mt-2 flex-wrap">
          <Button onClick={editor.save} disabled={saving} size="sm" className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-xs h-7">
            {saving ? 'Mentés...' : 'Mentés'}
          </Button>
          {editor.confirmCancel ? (
            <DirtyCancelRow show onDiscard={editor.cancel} onDismiss={() => editor.setConfirmCancel(false)} />
          ) : (
            <Button onClick={editor.cancel} variant="outline" size="sm" className="text-xs h-7">
              Mégse
            </Button>
          )}
          {trip && dayNum != null && itemIndex != null && (
            <Button onClick={editor.toggleItemAi} variant="outline" size="sm" className="sm:ml-auto text-purple-700 border-purple-300 hover:bg-purple-50 text-xs h-7">
              AI kitöltés
            </Button>
          )}
        </div>
        {editor.showItemAi && trip && (
          <AiSuggestionPanel<Partial<ScheduleItemDraft>>
            section="scheduleItem"
            trip={trip}
            extraBody={{ dayNum, itemIndex }}
            applyLabel="Alkalmazás"
            validateSuggestion={isScheduleItemSuggestion}
            onApply={s => {
              if (!editor.draft) return
              editor.setDraft({
                time: s.time || editor.draft.time,
                title: s.title || editor.draft.title,
                desc: s.desc || editor.draft.desc,
                highlight: s.highlight ?? editor.draft.highlight,
                optional: s.optional ?? editor.draft.optional,
                badges: s.badges?.length ? s.badges : editor.draft.badges,
                links: s.links?.length ? s.links : editor.draft.links,
                transport: s.transport?.length ? s.transport : editor.draft.transport,
                guide: {
                  ...editor.draft.guide,
                  history: s.guide?.history?.length ? s.guide.history : (editor.draft.guide.history || []),
                  mustSee: s.guide?.mustSee?.length ? s.guide.mustSee : (editor.draft.guide.mustSee || []),
                  funFacts: s.guide?.funFacts?.length ? s.guide.funFacts : (editor.draft.guide.funFacts || []),
                  tips: s.guide?.tips?.length ? s.guide.tips : (editor.draft.guide.tips || []),
                },
              })
              editor.toggleItemAi()
            }}
            renderPreview={s => (
              <div className="space-y-1 text-xs text-slate-700">
                <p><strong>{s.time}</strong> — {s.title}</p>
                {s.desc && <p className="text-slate-500">{s.desc}</p>}
                {s.badges && s.badges.length > 0 && <p className="text-slate-400">Badges: {s.badges.join(', ')}</p>}
                {s.links && s.links.length > 0 && <p className="text-slate-400">{s.links.length} link</p>}
                {(s.guide?.history?.length || s.guide?.tips?.length) ? <p className="text-slate-400">Guide info is</p> : null}
              </div>
            )}
          />
        )}
      </div>
    )
  }

  return (
    <div className={`group/sched flex gap-1 py-3 ${item.highlight ? 'bg-amber-50/60 px-4 -mx-4 border-l-3 border-amber-400' : 'border-b border-slate-100/80'}`}>
      <span className="text-[11px] md:text-[12px] text-slate-400 font-semibold tabular-nums shrink-0 w-[42px] md:w-[48px] pt-0.5">{item.time}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-[15px] md:text-[16px] text-slate-800 leading-snug">{item.title}</span>
          {item.badges?.map(b => (
            <Badge key={b} variant="outline" className={`text-[9px] font-semibold py-0 px-1.5 rounded-md ${
              b === 'INGYENES' ? 'bg-emerald-500 text-white border-emerald-500' :
              b === 'GYEREKBARÁT' || b === 'JÁTSZÓTÉR' ? 'bg-amber-500 text-white border-amber-500' :
              'bg-slate-100 text-slate-600'
            }`}>
              {b}
            </Badge>
          ))}
          {item.optional && <span className="text-[10px] text-slate-400 italic">(opcionális)</span>}
        </div>

        {(locationName || item.transport) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {locationName && mapLink && (
              <div className="flex items-center gap-0 rounded-lg overflow-hidden bg-blue-50 min-h-[32px]">
                <a href={mapLink.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] md:text-[12px] text-blue-600 hover:text-blue-800 transition-colors no-underline px-2 py-1.5 hover:bg-blue-100">
                  <MapPin className="w-3.5 h-3.5 shrink-0 fill-white stroke-blue-600 stroke-[2.5]" />
                  <span>{locationName}</span>
                </a>
                <button
                  onClick={() => handleCopy(locationName)}
                  className={`flex items-center px-2 py-1.5 hover:bg-blue-100 transition-colors border-l border-blue-200 cursor-pointer ${copied ? 'text-emerald-500' : 'text-blue-400 hover:text-blue-700'}`}
                  title="Másolás"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
            {item.transport?.map((t, i) => (
              <a key={i} href={t.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center text-[11px] md:text-[12px] font-medium px-2 py-1.5 rounded-lg no-underline min-h-[32px] transition-colors ${
                  t.type === 'transit'
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}>
                {t.label}
              </a>
            ))}
          </div>
        )}

        {item.desc && (
          <p className="text-[12px] md:text-[13px] text-slate-600 leading-[1.65]">{item.desc}</p>
        )}

        {otherLinks && otherLinks.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {otherLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="text-[#0f3460] text-[11px] md:text-[12px] underline underline-offset-2 hover:text-[#e94560] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        )}

        {item.guide && <GuideInfo guide={item.guide} />}
      </div>

      {!readOnly && <div className="flex flex-col items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover/sched:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
        <button onClick={editor.startEdit} aria-label="Program szerkesztése" className="text-gray-400 hover:text-[#0f3460] p-1 rounded hover:bg-slate-100">
          <SquarePen className="w-3 h-3" />
        </button>
        <button onClick={onMoveUp} disabled={isFirst} aria-label="Program fel" className="text-gray-400 hover:text-slate-700 p-0.5 disabled:opacity-20">
          <span className="text-[9px]">▲</span>
        </button>
        <button onClick={onMoveDown} disabled={isLast} aria-label="Program le" className="text-gray-400 hover:text-slate-700 p-0.5 disabled:opacity-20">
          <span className="text-[9px]">▼</span>
        </button>
        {confirmDelete ? (
          <div className="flex gap-1">
            <button onClick={onDelete} className="text-[9px] text-red-500 hover:text-red-700">Igen</button>
            <button onClick={() => setConfirmDelete(false)} className="text-[9px] text-gray-400">Nem</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} aria-label="Program törlése" className="text-red-400/60 hover:text-red-500 p-0.5">
            <span className="text-[9px]">✕</span>
          </button>
        )}
      </div>}

      {copied && (
        <div className="fixed bottom-6 inset-x-0 z-50 w-fit mx-auto bg-slate-800 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          Másolva!
        </div>
      )}
    </div>
  )
}
