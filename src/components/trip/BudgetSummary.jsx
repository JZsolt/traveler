import { useState, useRef } from 'react'
import { SquarePen } from 'lucide-react'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { useAdmin } from '@/hooks/useAdmin'
import { Button } from '@/components/ui/button'

const FIELDS = [
  { amount: 'lowPerFamily', label: 'lowPerFamilyLabel', defaultLabel: 'Spórolós / 1 család (2 fő + gyerek)' },
  { amount: 'comfortPerFamily', label: 'comfortPerFamilyLabel', defaultLabel: 'Komfort / 1 család (2 fő + gyerek)' },
  { amount: 'lowTotal', label: 'lowTotalLabel', defaultLabel: 'Spórolós / mind az 5 fő együtt' },
  { amount: 'comfortTotal', label: 'comfortTotalLabel', defaultLabel: 'Komfort / mind az 5 fő együtt' },
]

function BudgetEditor({ draft, onChange }) {
  function set(field, value) {
    onChange({ ...draft, [field]: value })
  }

  const inputClass = "w-full border border-white/30 bg-white/10 rounded-lg px-2 py-1 text-sm text-white placeholder:text-white/40"

  return (
    <div className="space-y-3">
      <div>
        <span className="text-[10px] text-white/50">Headline</span>
        <input type="text" value={draft.headline} onChange={e => set('headline', e.target.value)} placeholder="Pl. ~€800-1200 összesen" className={inputClass} />
      </div>
      <div>
        <span className="text-[10px] text-white/50">Összesítő felirat</span>
        <input type="text" value={draft.summaryLabel} onChange={e => set('summaryLabel', e.target.value)} placeholder="Pl. Teljes utazás becsült költségei" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {FIELDS.map(f => (
          <div key={f.amount} className="space-y-1">
            <input type="text" value={draft[f.amount]} onChange={e => set(f.amount, e.target.value)} placeholder="Összeg" className={inputClass + " text-center font-bold"} />
            <input type="text" value={draft[f.label]} onChange={e => set(f.label, e.target.value)} placeholder={f.defaultLabel} className={inputClass + " text-[10px]"} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BudgetSummary({ budget, trip, slug, refetch }) {
  const { isAdminUnlocked } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const initialDraft = useRef(null)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const b = budget || {}

  function handleEdit() {
    const d = {
      headline: b.headline || '',
      summaryLabel: b.summaryLabel || '',
      lowPerFamily: b.lowPerFamily || '',
      lowPerFamilyLabel: b.lowPerFamilyLabel || '',
      comfortPerFamily: b.comfortPerFamily || '',
      comfortPerFamilyLabel: b.comfortPerFamilyLabel || '',
      lowTotal: b.lowTotal || '',
      lowTotalLabel: b.lowTotalLabel || '',
      comfortTotal: b.comfortTotal || '',
      comfortTotalLabel: b.comfortTotalLabel || '',
    }
    initialDraft.current = JSON.stringify(d)
    setDraft(d)
    setEditing(true)
  }

  const [confirmCancel, setConfirmCancel] = useState(false)

  function handleCancel() {
    const isDirty = draft && JSON.stringify(draft) !== initialDraft.current
    if (isDirty && !confirmCancel) {
      setConfirmCancel(true)
      return
    }
    setDraft(null)
    setEditing(false)
    setConfirmCancel(false)
  }

  async function handleSave() {
    const updated = { ...(budget || {}), ...draft }
    const result = await saveTrip(t => ({ ...t, budget: updated }))
    if (result.ok) {
      setDraft(null)
      setEditing(false)
    }
    return result
  }

  if (!b.lowPerFamily && !editing) return null

  const rows = [
    { amount: b.lowPerFamily, label: b.lowPerFamilyLabel || 'Spórolós / 1 család (2 fő + gyerek)' },
    { amount: b.comfortPerFamily, label: b.comfortPerFamilyLabel || 'Komfort / 1 család (2 fő + gyerek)' },
    { amount: b.lowTotal, label: b.lowTotalLabel || 'Spórolós / mind az 5 fő együtt' },
    { amount: b.comfortTotal, label: b.comfortTotalLabel || 'Komfort / mind az 5 fő együtt' }
  ]

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white p-5 rounded-2xl mt-5 relative group/budget">
      {isAdminUnlocked && !editing && (
        <button
          onClick={handleEdit}
          className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover/budget:opacity-100 focus:opacity-100 transition-opacity text-white/40 hover:text-white p-1.5 rounded-full hover:bg-white/10"
        >
          <SquarePen className="w-3.5 h-3.5" />
        </button>
      )}

      {editing ? (
        <>
          <h3 className="text-sm md:text-base font-bold mb-3">💰 Költségvetés szerkesztése</h3>
          <BudgetEditor draft={draft} onChange={setDraft} />
          {error && <p className="text-xs text-red-300 mt-2">{error}</p>}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button onClick={handleSave} disabled={saving} size="sm" className="bg-[#e94560] hover:bg-[#d63d56] text-white">
              {saving ? 'Mentés...' : 'Mentés'}
            </Button>
            {confirmCancel ? (
              <>
                <span className="text-xs text-yellow-300">Nem mentett módosítások elvesznek.</span>
                <Button onClick={handleCancel} variant="ghost" size="sm" className="border border-red-400/50 text-red-300 hover:bg-red-500/20">Elvetés</Button>
                <Button onClick={() => setConfirmCancel(false)} variant="ghost" size="sm" className="border border-white/30 text-white hover:bg-white/10">Vissza</Button>
              </>
            ) : (
              <Button onClick={handleCancel} disabled={saving} variant="ghost" size="sm" className="border border-white/30 text-white hover:bg-white/10">
                Mégse
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-sm md:text-base font-bold mb-1">💰 Költségvetés összesítő</h3>
          <p className="text-[10px] opacity-50 mb-3">
            {b.summaryLabel || 'Teljes utazás (5 nap) becsült költségei — repjegy nélkül'}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {rows.map((row, i) => (
              <div key={i} className="bg-white/10 p-3 rounded-xl text-center">
                <div className="text-lg md:text-2xl font-extrabold text-[#e94560]">{row.amount}</div>
                <div className="text-[10px] md:text-xs opacity-70 mt-1">{row.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
