import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { withPracticalInfoEditorId } from '@/lib/practicalInfoEditor'
import type { PracticalInfoSection } from '@/types/trip'
import type { PracticalInfoEditorProps, PracticalInfoItemsEditorProps } from '@/types/components'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

function ItemsEditor({ items, onChange }: PracticalInfoItemsEditorProps) {
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
    <div className="space-y-1.5 pl-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <input type="text" value={item} onChange={e => updateItem(i, e.target.value)} className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1 text-sm" />
          <Button variant="ghost" size="icon-xs" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Fel"><ChevronUp className="w-3 h-3" /></Button>
          <Button variant="ghost" size="icon-xs" onClick={() => moveDown(i)} disabled={i >= items.length - 1} aria-label="Le"><ChevronDown className="w-3 h-3" /></Button>
          <Button variant="ghost" size="icon-xs" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600" aria-label="Törlés"><X className="w-3 h-3" /></Button>
        </div>
      ))}
      <div className="flex items-center gap-1">
        <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Új elem..." className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1 text-sm" />
        <Button variant="outline" size="xs" onClick={addItem}>+</Button>
      </div>
    </div>
  )
}

export function PracticalInfoEditor({ sections, onChange, validationError }: PracticalInfoEditorProps) {
  function updateSection(index: number, field: keyof PracticalInfoSection, value: string) {
    const updated = [...sections]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  function updateSectionItems(index: number, items: string[]) {
    const updated = [...sections]
    updated[index] = { ...updated[index], items }
    onChange(updated)
  }

  function addSection() {
    onChange([...sections, withPracticalInfoEditorId({ title: '', items: [] })])
  }

  function removeSection(index: number) {
    onChange(sections.filter((_, i) => i !== index))
  }

  function moveUp(index: number) {
    if (index === 0) return
    const updated = [...sections]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onChange(updated)
  }

  function moveDown(index: number) {
    if (index >= sections.length - 1) return
    const updated = [...sections]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {sections.map((section, i) => (
        <div key={section._eid ?? i} className="border border-gray-200 rounded-xl p-2.5 space-y-2">
          <div className="flex items-center gap-1.5">
            <input type="text" value={section.title} onChange={e => updateSection(i, 'title', e.target.value)} placeholder="Szekció cím *" className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-base font-medium" />
            <Button variant="ghost" size="icon-xs" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Fel"><ChevronUp className="w-3 h-3" /></Button>
            <Button variant="ghost" size="icon-xs" onClick={() => moveDown(i)} disabled={i >= sections.length - 1} aria-label="Le"><ChevronDown className="w-3 h-3" /></Button>
            <Button variant="ghost" size="icon-xs" onClick={() => removeSection(i)} className="text-red-400 hover:text-red-600" aria-label="Törlés"><X className="w-3 h-3" /></Button>
          </div>
          <ItemsEditor items={section.items || []} onChange={items => updateSectionItems(i, items)} />
        </div>
      ))}
      {validationError && <p className="text-xs text-red-600">{validationError}</p>}
      <Button variant="outline" size="sm" onClick={addSection}>+ Új szekció</Button>
    </div>
  )
}
