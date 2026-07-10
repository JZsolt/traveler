import { useState } from 'react'
import { EditableSection } from '@/components/editor/EditableSection'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { replaceTripSection } from '@/lib/tripSections'
import { getPersonCount } from '@/lib/personCount'
import { Button } from '@/components/ui/button'
import { isSavingTipArray } from '@/types/guards'
import type { SavingTip } from '@/types/trip'
import type { SavingTipsEditorProps, SavingTipsProps } from '@/types/components'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

const EMPTY_TIP: SavingTip = { tip: '', saving: '' }

function SavingTipsEditor({ items, onChange, validationError }: SavingTipsEditorProps) {
  function updateItem(index: number, field: keyof SavingTip, value: string) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  function addItem() {
    onChange([...items, { ...EMPTY_TIP }])
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function moveUp(index: number) {
    if (index === 0) return
    const updated = [...items]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onChange(updated)
  }

  function moveDown(index: number) {
    if (index >= items.length - 1) return
    const updated = [...items]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <div className="flex-1 min-w-0 space-y-1">
            <input
              type="text"
              value={item.tip}
              onChange={e => updateItem(i, 'tip', e.target.value)}
              placeholder="Tipp *"
              className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base"
            />
            <input
              type="text"
              value={item.saving}
              onChange={e => updateItem(i, 'saving', e.target.value)}
              placeholder="Megtakaritas"
              className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base"
            />
          </div>
          <div className="flex flex-col gap-0.5 pt-1">
            <Button variant="ghost" size="icon-xs" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Fel">
              <ChevronUp className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => moveDown(i)} disabled={i >= items.length - 1} aria-label="Le">
              <ChevronDown className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600" aria-label="Törlés">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
      {validationError && (
        <p className="text-xs text-red-600">{validationError}</p>
      )}
      <Button variant="outline" size="sm" onClick={addItem}>
        + Új tipp
      </Button>
    </div>
  )
}

export function SavingTips({ tips, label, trip, slug, refetch }: SavingTipsProps) {
  const personCount = getPersonCount(trip?.people)
  const [draft, setDraft] = useState<SavingTip[] | null>(null)
  const [showAi, setShowAi] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const displayItems = tips || []

  function handleCancel() {
    setDraft(null)
    setShowAi(false)
    setValidationError(null)
  }

  async function handleSave() {
    const nextItems = draft ?? displayItems
    const emptyTip = nextItems.find(t => !t.tip?.trim())
    if (emptyTip) {
      setValidationError('Minden tippnek kell szöveg.')
      return { ok: false }
    }
    setValidationError(null)
    const result = await saveTrip(t => replaceTripSection(t, 'savingTips', nextItems))
    if (result.ok) { setDraft(null); setShowAi(false) }
    return result
  }

  function handleApply(suggestion: SavingTip[]) {
    const current = draft ?? displayItems
    const existing = new Set(current.map(t => t.tip.toLowerCase().trim()))
    const newItems = suggestion.filter(t => !existing.has(t.tip.toLowerCase().trim()))
    setDraft([...current, ...newItems])
  }

  const editor = (
    <>
      <SavingTipsEditor
        items={draft ?? displayItems}
        onChange={setDraft}
        validationError={validationError}
      />
      {showAi && (
        <AiSuggestionPanel<SavingTip[]>
          section="savingTips"
          trip={trip}
          validateSuggestion={isSavingTipArray}
          onApply={handleApply}
          renderPreview={items => (
            <ul className="space-y-0.5">
              {items.map((t, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                  <span className="text-purple-400">+</span> {t.tip} <span className="text-slate-400">({t.saving})</span>
                </li>
              ))}
            </ul>
          )}
        />
      )}
    </>
  )

  return (
    <EditableSection
      title="💰 Pénz-spórolási tippek"
      editor={editor}
      onSave={handleSave}
      onCancel={handleCancel}
      saving={saving}
      error={error}
      isDirty={draft !== null}
      canUseAi
      onAi={() => setShowAi(s => !s)}
    >
      {displayItems.length === 0 ? (
        <p className="text-xs text-gray-400">Nincs tipp.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Tipp</th>
                <th className="p-2 text-right">{label || `Megtakarítás (${personCount} fő)`}</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((tip, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-1.5">{i + 1}</td>
                  <td className="p-1.5">{tip.tip}</td>
                  <td className="p-1.5 text-right font-semibold">{tip.saving}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </EditableSection>
  )
}
