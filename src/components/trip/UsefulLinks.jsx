import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { EditableSection } from '@/components/editor/EditableSection'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { replaceTripSection } from '@/lib/tripSections'
import { Button } from '@/components/ui/button'

const EMPTY_LINK = { emoji: '🔗', name: '', desc: '', url: '' }

function UsefulLinksEditor({ items, onChange, validationError }) {
  function updateItem(index, field, value) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  function addItem() {
    onChange([...items, { ...EMPTY_LINK }])
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
    <div className="space-y-3">
      {items.map((link, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={link.emoji}
              onChange={e => updateItem(i, 'emoji', e.target.value)}
              className="w-10 border border-gray-200 rounded-lg px-1.5 py-1 text-center text-base"
            />
            <input
              type="text"
              value={link.name}
              onChange={e => updateItem(i, 'name', e.target.value)}
              placeholder="Nev *"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1 text-base"
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
          <input
            type="text"
            value={link.desc}
            onChange={e => updateItem(i, 'desc', e.target.value)}
            placeholder="Leiras"
            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base"
          />
          <input
            type="url"
            value={link.url}
            onChange={e => updateItem(i, 'url', e.target.value)}
            placeholder="URL"
            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base"
          />
        </div>
      ))}
      {validationError && (
        <p className="text-xs text-red-600">{validationError}</p>
      )}
      <Button variant="outline" size="sm" onClick={addItem}>
        + Uj link
      </Button>
    </div>
  )
}

export function UsefulLinks({ links, trip, slug, refetch }) {
  const [draft, setDraft] = useState(null)
  const [showAi, setShowAi] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const displayItems = links || []

  function handleCancel() {
    setDraft(null)
    setShowAi(false)
    setValidationError(null)
  }

  async function handleSave() {
    const nextItems = draft ?? displayItems
    const emptyName = nextItems.find(l => !l.name?.trim())
    if (emptyName) {
      setValidationError('Minden linknek kell nev.')
      return { ok: false }
    }
    setValidationError(null)
    const result = await saveTrip(t => replaceTripSection(t, 'usefulLinks', nextItems))
    if (result.ok) { setDraft(null); setShowAi(false) }
    return result
  }

  function handleApply(suggestion) {
    const current = draft ?? displayItems
    const existing = new Set(current.map(l => l.name.toLowerCase().trim()))
    const newItems = suggestion.filter(l => !existing.has(l.name.toLowerCase().trim()))
    setDraft([...current, ...newItems])
  }

  const editor = (
    <>
      <UsefulLinksEditor
        items={draft ?? displayItems}
        onChange={setDraft}
        validationError={validationError}
      />
      {showAi && (
        <AiSuggestionPanel
          section="usefulLinks"
          trip={trip}
          onApply={handleApply}
          renderPreview={items => (
            <ul className="space-y-0.5">
              {items.map((l, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                  <span className="text-purple-400">+</span> {l.emoji} {l.name} — {l.desc}
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
      title="🔗 Hasznos linkek"
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
        <p className="text-xs text-gray-400">Nincs link.</p>
      ) : (
        <div className="space-y-1.5">
          {displayItems.map((link, i) => {
            const Wrapper = link.url ? 'a' : 'div'
            const wrapperProps = link.url
              ? { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
              : {}
            return (
              <Wrapper
                key={i}
                {...wrapperProps}
                className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors no-underline text-[#1a1a2e]"
              >
                <span className="text-xl shrink-0">{link.emoji}</span>
                <div className="flex-1 min-w-0">
                  <strong className="block text-xs">{link.name}</strong>
                  <span className="text-[10px] text-gray-500">{link.desc}</span>
                </div>
                {link.url && <ExternalLink className="w-3.5 h-3.5 opacity-30 shrink-0" />}
              </Wrapper>
            )
          })}
        </div>
      )}
    </EditableSection>
  )
}
