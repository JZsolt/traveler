import { useState } from 'react'
import { EditableSection } from '@/components/editor/EditableSection'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { replaceTripSection } from '@/lib/tripSections'
import { Button } from '@/components/ui/button'

const EMPTY_ITEM = { item: '', url: '', done: false }

function BookingChecklistEditor({ items, onChange, validationError }) {
  function updateItem(index, field, value) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  function toggleDone(index) {
    const updated = [...items]
    updated[index] = { ...updated[index], done: !updated[index].done }
    onChange(updated)
  }

  function addItem() {
    onChange([...items, { ...EMPTY_ITEM }])
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
  }

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
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <button
            type="button"
            onClick={() => toggleDone(i)}
            className="mt-1.5 text-base shrink-0"
            aria-label={item.done ? 'Visszaállítás' : 'Kész'}
          >
            {item.done ? '✅' : '☐'}
          </button>
          <div className="flex-1 min-w-0 space-y-1">
            <input
              type="text"
              value={item.item}
              onChange={e => updateItem(i, 'item', e.target.value)}
              placeholder="Teendő *"
              className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base"
            />
            <input
              type="url"
              value={item.url}
              onChange={e => updateItem(i, 'url', e.target.value)}
              placeholder="URL (opcionális)"
              className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base"
            />
          </div>
          <div className="flex flex-col gap-0.5 pt-1">
            <Button variant="ghost" size="icon-xs" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Fel">
              <span className="text-[10px]">▲</span>
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => moveDown(i)} disabled={i >= items.length - 1} aria-label="Le">
              <span className="text-[10px]">▼</span>
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600" aria-label="Törlés">
              <span className="text-[10px]">✕</span>
            </Button>
          </div>
        </div>
      ))}
      {validationError && (
        <p className="text-xs text-red-600">{validationError}</p>
      )}
      <Button variant="outline" size="sm" onClick={addItem}>
        + Új elem
      </Button>
    </div>
  )
}

export function BookingChecklist({ items, trip, slug, refetch }) {
  const [draft, setDraft] = useState(null)
  const [showAi, setShowAi] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const displayItems = items || []

  function handleCancel() {
    setDraft(null)
    setShowAi(false)
    setValidationError(null)
  }

  async function handleSave() {
    const nextItems = draft ?? displayItems
    const emptyItem = nextItems.find(t => !t.item?.trim())
    if (emptyItem) {
      setValidationError('Minden elemnek kell szöveg.')
      return { ok: false }
    }
    setValidationError(null)
    const result = await saveTrip(t => replaceTripSection(t, 'bookingChecklist', nextItems))
    if (result.ok) { setDraft(null); setShowAi(false) }
    return result
  }

  function handleApply(suggestion) {
    const current = draft ?? displayItems
    const existing = new Set(current.map(b => b.item.toLowerCase().trim()))
    const newItems = suggestion.filter(b => !existing.has(b.item.toLowerCase().trim()))
    setDraft([...current, ...newItems])
  }

  const editor = (
    <>
      <BookingChecklistEditor
        items={draft ?? displayItems}
        onChange={setDraft}
        validationError={validationError}
      />
      {showAi && (
        <AiSuggestionPanel
          section="bookingChecklist"
          trip={trip}
          onApply={handleApply}
          renderPreview={items => (
            <ul className="space-y-0.5">
              {items.map((b, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                  <span className="text-purple-400">+</span> {b.item}
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
      title="☐ Foglalási checklist"
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
        <p className="text-xs text-gray-400">Nincs elem.</p>
      ) : (
        <ul className="space-y-1.5">
          {displayItems.map((item, i) => (
            <li key={i} className={`flex items-start gap-2 text-xs py-1.5 border-b border-slate-100 ${item.done ? 'opacity-60' : ''}`}>
              <span className="text-base">{item.done ? '✅' : '☐'}</span>
              <span>
                <strong className={item.done ? 'line-through' : ''}>{item.item}</strong>
                {item.url && !item.done && (
                  <>
                    {' → '}
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#0f3460] underline">
                      Foglalás
                    </a>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </EditableSection>
  )
}
