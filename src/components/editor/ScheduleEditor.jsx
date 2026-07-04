import { ArrayEditor } from './ArrayEditor'

export function ScheduleEditor({ draft, onChange, aiGuidePanel }) {
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
