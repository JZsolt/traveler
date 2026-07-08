import { useState } from 'react'
import { EditableSection } from '@/components/editor/EditableSection'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { replaceTripSection } from '@/lib/tripSections'
import { Button } from '@/components/ui/button'
import { isStringArray } from '@/types/guards'
import type { PackingListEditorProps, PackingListProps } from '@/types/components'

function PackingListEditor({ items, onChange }: PackingListEditorProps) {
  const [newItem, setNewItem] = useState('')

  function addItem() {
    const text = newItem.trim()
    if (!text) return
    onChange([...items, text])
    setNewItem('')
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, value: string) {
    const updated = [...items]
    updated[index] = value
    onChange(updated)
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
        <div key={i} className="flex items-center gap-1.5">
          <input
            type="text"
            value={item}
            onChange={e => updateItem(i, e.target.value)}
            className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-base"
          />
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
      ))}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Új elem..."
          className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-base"
        />
        <Button variant="outline" size="xs" onClick={addItem}>
          +
        </Button>
      </div>
    </div>
  )
}

export function PackingList({ items, trip, slug, refetch }: PackingListProps) {
  const [draft, setDraft] = useState<string[] | null>(null)
  const [showAi, setShowAi] = useState(false)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const displayItems = items || []

  function handleCancel() {
    setDraft(null)
    setShowAi(false)
  }

  async function handleSave() {
    const nextItems = draft ?? displayItems
    const result = await saveTrip(t => replaceTripSection(t, 'packingList', nextItems))
    if (result.ok) {
      setDraft(null)
      setShowAi(false)
    }
    return result
  }

  function handleApply(suggestion: string[]) {
    const current = draft ?? displayItems
    const existing = new Set(current.map(s => s.toLowerCase().trim()))
    const newItems = suggestion.filter(s => !existing.has(s.toLowerCase().trim()))
    setDraft([...current, ...newItems])
  }

  const editor = (
    <>
      <PackingListEditor items={draft ?? displayItems} onChange={setDraft} />
      {showAi && (
        <AiSuggestionPanel<string[]>
          section="packingList"
          trip={trip}
          validateSuggestion={isStringArray}
          onApply={handleApply}
          renderPreview={items => (
            <ul className="space-y-0.5">
              {items.map((item, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                  <span className="text-purple-400">+</span> {item}
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
      title="🎒 Csomagolási emlékeztető"
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
            <li key={i} className="flex items-start gap-2 text-xs py-1 border-b border-slate-100">
              <span className="text-base">☐</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </EditableSection>
  )
}
