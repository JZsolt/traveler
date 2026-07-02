import { useState, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { MapPin, Copy, Check, SquarePen } from 'lucide-react'
import { GuideInfo } from './GuideInfo'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { Button } from '@/components/ui/button'

function extractLocationName(url) {
  if (!url) return null
  try {
    const qMatch = url.match(/[?&]q=([^&]+)/)
    if (qMatch) return decodeURIComponent(qMatch[1]).replace(/\+/g, ' ')
    const dirMatch = url.match(/\/dir\/[^/]+\/([^/?]+)/)
    if (dirMatch) return decodeURIComponent(dirMatch[1]).replace(/\+/g, ' ')
  } catch { /* ignore */ }
  return null
}

function ArrayEditor({ items, onChange, placeholder, renderItem }) {
  function update(index, value) {
    const updated = [...items]
    updated[index] = value
    onChange(updated)
  }
  function remove(index) { onChange(items.filter((_, i) => i !== index)) }
  function moveUp(index) {
    if (index === 0) return
    const updated = [...items]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onChange(updated)
  }
  function moveDown(index) {
    if (index >= items.length - 1) return
    const updated = [...items]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onChange(updated)
  }
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1">
          <div className="flex-1 min-w-0">{renderItem(item, v => update(i, v))}</div>
          <button onClick={() => moveUp(i)} disabled={i === 0} aria-label="Fel" className="text-[9px] text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5">▲</button>
          <button onClick={() => moveDown(i)} disabled={i >= items.length - 1} aria-label="Le" className="text-[9px] text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5">▼</button>
          <button onClick={() => remove(i)} aria-label="Törlés" className="text-[9px] text-red-400 hover:text-red-600 p-0.5">✕</button>
        </div>
      ))}
      <button onClick={() => onChange([...items, typeof placeholder === 'function' ? placeholder() : placeholder])} className="text-[10px] text-[#0f3460] hover:underline">+ Hozzáadás</button>
    </div>
  )
}

function ScheduleEditor({ draft, onChange, aiGuidePanel }) {
  function set(field, value) {
    onChange({ ...draft, [field]: value })
  }

  function setGuide(field, value) {
    onChange({ ...draft, guide: { ...draft.guide, [field]: value } })
  }

  const inp = "w-full border border-gray-200 rounded-lg px-2 py-1 text-xs"

  return (
    <div className="space-y-2 py-1">
      <div className="flex gap-2">
        <input type="text" value={draft.time} onChange={e => set('time', e.target.value)} placeholder="Idő" className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm" />
        <input type="text" value={draft.title} onChange={e => set('title', e.target.value)} placeholder="Cím" className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold" />
      </div>
      <textarea value={draft.desc} onChange={e => set('desc', e.target.value)} placeholder="Leírás" rows={2} className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm resize-y" />
      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={draft.highlight} onChange={e => set('highlight', e.target.checked)} />
          Kiemelt
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={draft.optional} onChange={e => set('optional', e.target.checked)} />
          Opcionális
        </label>
      </div>

      <details className="border border-gray-100 rounded-lg p-2">
        <summary className="text-[11px] text-slate-500 cursor-pointer font-medium">Részletek (badges, linkek, guide...)</summary>
        <div className="mt-2 space-y-3">
          <div>
            <label className="text-[10px] font-medium text-slate-500">Badges</label>
            <ArrayEditor items={draft.badges} onChange={v => set('badges', v)} placeholder=""
              renderItem={(b, upd) => <input type="text" value={b} onChange={e => upd(e.target.value)} placeholder="Badge" className={inp} />}
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500">Linkek</label>
            <ArrayEditor items={draft.links} onChange={v => set('links', v)} placeholder={() => ({ label: '', url: '' })}
              renderItem={(l, upd) => (
                <div className="flex gap-1">
                  <input type="text" value={l.label} onChange={e => upd({ ...l, label: e.target.value })} placeholder="Label" className={inp + " w-1/3"} />
                  <input type="url" value={l.url} onChange={e => upd({ ...l, url: e.target.value })} placeholder="URL" className={inp + " flex-1"} />
                </div>
              )}
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500">Közlekedés</label>
            <ArrayEditor items={draft.transport} onChange={v => set('transport', v)} placeholder={() => ({ type: '', label: '', url: '' })}
              renderItem={(t, upd) => (
                <div className="flex gap-1">
                  <input type="text" value={t.type} onChange={e => upd({ ...t, type: e.target.value })} placeholder="Típus" className={inp + " w-16"} />
                  <input type="text" value={t.label} onChange={e => upd({ ...t, label: e.target.value })} placeholder="Label" className={inp + " flex-1"} />
                  <input type="url" value={t.url} onChange={e => upd({ ...t, url: e.target.value })} placeholder="URL" className={inp + " flex-1"} />
                </div>
              )}
            />
          </div>
          {['history', 'mustSee', 'funFacts', 'tips'].map(key => (
            <div key={key}>
              <label className="text-[10px] font-medium text-slate-500">Guide: {key}</label>
              <ArrayEditor items={draft.guide[key] || []} onChange={v => setGuide(key, v)} placeholder=""
                renderItem={(s, upd) => <input type="text" value={s} onChange={e => upd(e.target.value)} placeholder={key} className={inp} />}
              />
            </div>
          ))}
          {aiGuidePanel}
        </div>
      </details>
    </div>
  )
}

export function ScheduleItem({ item, onSave, saving, error, isFirst, isLast, onMoveUp, onMoveDown, onDelete, trip, dayNum, itemIndex, readOnly }) {
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showItemAi, setShowItemAi] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const initialDraft = useRef(null)
  const mapLink = item.links?.find(l => l.label.includes('Térkép') || l.label.includes('📍'))
  const otherLinks = item.links?.filter(l => l !== mapLink)
  const locationName = mapLink ? extractLocationName(mapLink.url) : null

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleEdit() {
    const g = item.guide || {}
    const d = {
      time: item.time || '',
      title: item.title || '',
      desc: item.desc || '',
      highlight: !!item.highlight,
      optional: !!item.optional,
      badges: [...(item.badges || [])],
      links: (item.links || []).map(l => ({ ...l })),
      transport: (item.transport || []).map(t => ({ ...t })),
      guide: {
        ...g,
        history: [...(g.history || [])],
        mustSee: [...(g.mustSee || [])],
        funFacts: [...(g.funFacts || [])],
        tips: [...(g.tips || [])],
      },
    }
    initialDraft.current = JSON.stringify(d)
    setDraft(d)
    setEditing(true)
  }

  function handleCancelEdit() {
    const isDirty = draft && JSON.stringify(draft) !== initialDraft.current
    if (isDirty && !confirmCancel) {
      setConfirmCancel(true)
      return
    }
    setDraft(null)
    setEditing(false)
    setConfirmCancel(false)
    setShowItemAi(false)
  }

  async function handleSaveEdit() {
    if (!onSave) return
    if (!draft.title?.trim()) {
      setValidationError('A program neve kötelező.')
      return
    }
    setValidationError(null)
    const guide = { ...(item.guide || {}), ...draft.guide }
    const result = await onSave({
      time: draft.time,
      title: draft.title,
      desc: draft.desc,
      highlight: draft.highlight || undefined,
      optional: draft.optional || undefined,
      badges: draft.badges.length ? draft.badges : undefined,
      links: draft.links,
      transport: draft.transport.length ? draft.transport : undefined,
      guide,
    })
    if (result?.ok !== false) {
      setDraft(null)
      setEditing(false)
    }
  }

  if (editing && !readOnly) {
    return (
      <div className="py-2 border-b border-slate-100/80">
        <ScheduleEditor draft={draft} onChange={setDraft} aiGuidePanel={
          trip && dayNum != null && itemIndex != null ? (
            <div>
              <label className="text-[10px] font-medium text-slate-500">AI guide javaslat</label>
              <AiSuggestionPanel
                section="scheduleItemGuide"
                trip={trip}
                extraBody={{ dayNum, itemIndex }}
                onApply={s => {
                  setDraft(prev => ({
                    ...prev,
                    guide: {
                      ...prev.guide,
                      history: [...(prev.guide.history || []), ...(s.history || [])],
                      mustSee: [...(prev.guide.mustSee || []), ...(s.mustSee || [])],
                      funFacts: [...(prev.guide.funFacts || []), ...(s.funFacts || [])],
                      tips: [...(prev.guide.tips || []), ...(s.tips || [])],
                    },
                  }))
                }}
                renderPreview={s => (
                  <div className="space-y-1 text-xs text-slate-700">
                    {['history', 'mustSee', 'funFacts', 'tips'].map(key => (
                      s[key]?.length > 0 && (
                        <div key={key}>
                          <p className="font-medium text-slate-500">{key}:</p>
                          {s[key].map((t, i) => <p key={i} className="ml-2"><span className="text-purple-400">+</span> {t}</p>)}
                        </div>
                      )
                    ))}
                  </div>
                )}
              />
            </div>
          ) : null
        } />
        {(validationError || error) && <p className="text-xs text-red-600 mt-1">{validationError || error}</p>}
        <div className="flex gap-2 mt-2 flex-wrap">
          <Button onClick={handleSaveEdit} disabled={saving} size="sm" className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-xs h-7">
            {saving ? 'Mentés...' : 'Mentés'}
          </Button>
          {confirmCancel ? (
            <>
              <span className="text-[10px] text-yellow-600">Nem mentett módosítások elvesznek.</span>
              <Button onClick={handleCancelEdit} variant="outline" size="sm" className="text-xs h-7 border-red-300 text-red-600 hover:bg-red-50">Elvetés</Button>
              <Button onClick={() => setConfirmCancel(false)} variant="outline" size="sm" className="text-xs h-7">Vissza</Button>
            </>
          ) : (
            <Button onClick={handleCancelEdit} variant="outline" size="sm" className="text-xs h-7">
              Mégse
            </Button>
          )}
          {trip && dayNum != null && itemIndex != null && (
            <Button onClick={() => setShowItemAi(s => !s)} variant="outline" size="sm" className="sm:ml-auto text-purple-700 border-purple-300 hover:bg-purple-50 text-xs h-7">
              AI kitöltés
            </Button>
          )}
        </div>
        {showItemAi && trip && (
          <AiSuggestionPanel
            section="scheduleItem"
            trip={trip}
            extraBody={{ dayNum, itemIndex }}
            applyLabel="Alkalmazás"
            onApply={s => {
              setDraft({
                time: s.time || draft.time,
                title: s.title || draft.title,
                desc: s.desc || draft.desc,
                highlight: s.highlight ?? draft.highlight,
                optional: s.optional ?? draft.optional,
                badges: s.badges?.length ? s.badges : draft.badges,
                links: s.links?.length ? s.links : draft.links,
                transport: s.transport?.length ? s.transport : draft.transport,
                guide: {
                  ...draft.guide,
                  history: s.guide?.history?.length ? s.guide.history : (draft.guide.history || []),
                  mustSee: s.guide?.mustSee?.length ? s.guide.mustSee : (draft.guide.mustSee || []),
                  funFacts: s.guide?.funFacts?.length ? s.guide.funFacts : (draft.guide.funFacts || []),
                  tips: s.guide?.tips?.length ? s.guide.tips : (draft.guide.tips || []),
                },
              })
              setShowItemAi(false)
            }}
            renderPreview={s => (
              <div className="space-y-1 text-xs text-slate-700">
                <p><strong>{s.time}</strong> — {s.title}</p>
                {s.desc && <p className="text-slate-500">{s.desc}</p>}
                {s.badges?.length > 0 && <p className="text-slate-400">Badges: {s.badges.join(', ')}</p>}
                {s.links?.length > 0 && <p className="text-slate-400">{s.links.length} link</p>}
                {(s.guide?.history?.length > 0 || s.guide?.tips?.length > 0) && <p className="text-slate-400">Guide info is</p>}
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
            {locationName && (
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

        {otherLinks?.length > 0 && (
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
        <button onClick={handleEdit} aria-label="Program szerkesztése" className="text-gray-400 hover:text-[#0f3460] p-1 rounded hover:bg-slate-100">
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
