import { useState } from 'react'
import { EditableSection } from '@/components/editor/EditableSection'
import { AiSuggestionPanel } from '@/components/editor/AiSuggestionPanel'
import { PracticalInfoEditor } from './PracticalInfoEditor'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { replaceTripSection } from '@/lib/tripSections'
import { stripPracticalInfoEditorIds, withPracticalInfoEditorId } from '@/lib/practicalInfoEditor'
import { isPracticalInfoSuggestionSectionArray } from '@/types/guards'
import type { PracticalInfoSection } from '@/types/trip'
import type {
  PracticalInfoEditableSection,
  PracticalInfoProps,
  PracticalInfoSuggestionSection,
} from '@/types/components'

export function PracticalInfo({ sections, trip, slug, refetch }: PracticalInfoProps) {
  const [draft, setDraft] = useState<PracticalInfoEditableSection[] | null>(null)
  const [showAi, setShowAi] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const displaySections = sections || []

  function handleCancel() {
    setDraft(null)
    setShowAi(false)
    setValidationError(null)
  }

  async function handleSave() {
    const nextSections = draft ?? startEditing(displaySections)
    const emptyTitle = nextSections.find(s => !s.title?.trim())
    if (emptyTitle) {
      setValidationError('Minden szekciónak kell cím.')
      return { ok: false }
    }
    setValidationError(null)
    const result = await saveTrip(t => replaceTripSection(t, 'practicalInfo', stripPracticalInfoEditorIds(nextSections)))
    if (result.ok) { setDraft(null); setShowAi(false) }
    return result
  }

  function startEditing(sections: PracticalInfoSection[]) {
    return sections.map(withPracticalInfoEditorId)
  }

  function handleApply(suggestion: PracticalInfoSuggestionSection[]) {
    const current = draft ?? startEditing(displaySections)
    const existingTitles = new Set(current.map(s => s.title.toLowerCase().trim()))
    const newSections = suggestion
      .filter(s => !existingTitles.has(s.title.toLowerCase().trim()))
      .map(s => withPracticalInfoEditorId({
        title: s.title,
        items: (s.items || []).map(i => `${i.label}: ${i.value}`),
      }))
    setDraft([...current, ...newSections])
  }

  const editSections = draft ?? startEditing(displaySections)

  const editor = (
    <>
      <PracticalInfoEditor
        sections={editSections}
        onChange={setDraft}
        validationError={validationError}
      />
      {showAi && (
        <AiSuggestionPanel<PracticalInfoSuggestionSection[]>
          section="practicalInfo"
          trip={trip}
          validateSuggestion={isPracticalInfoSuggestionSectionArray}
          onApply={handleApply}
          renderPreview={items => (
            <div className="space-y-1.5">
              {items.map((s, i) => (
                <div key={i}>
                  <p className="text-xs font-medium text-slate-700"><span className="text-purple-400">+</span> {s.title}</p>
                  <ul className="ml-4 space-y-0">
                    {(s.items || []).map((item, j) => (
                      <li key={j} className="text-[11px] text-slate-500">{item.label}: {item.value}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        />
      )}
    </>
  )

  return (
    <EditableSection
      title="ℹ️ Praktikus infók"
      editor={editor}
      onSave={handleSave}
      onCancel={handleCancel}
      saving={saving}
      error={error}
      isDirty={draft !== null}
      canUseAi
      onAi={() => setShowAi(s => !s)}
    >
      {displaySections.length === 0 ? (
        <p className="text-xs text-gray-400">Nincs info.</p>
      ) : (
        <div className="space-y-3">
          {displaySections.map((section, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-2.5 rounded-lg text-[13px] md:text-[14px] font-medium text-slate-700 list-none">
                <span>{section.title}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <ul className="mt-1.5 space-y-1 pl-3">
                {(section.items || []).map((item, j) => (
                  <li key={j} className="text-[12px] md:text-[13px] text-slate-600 leading-[1.65] list-disc marker:text-slate-300 ml-2">{item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </EditableSection>
  )
}
