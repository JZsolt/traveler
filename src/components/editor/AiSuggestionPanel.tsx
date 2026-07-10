import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { API } from '@/lib/constants'
import { SuggestSectionEnvelopeSchema, ChatErrorEnvelopeSchema } from '@/schemas/ai'
import type { AiSuggestionPanelProps } from '@/types/editor'

export function AiSuggestionPanel<T>({ section, trip, onApply, renderPreview, validateSuggestion, applyLabel = 'Alkalmazás', extraBody }: AiSuggestionPanelProps<T>) {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<T | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setSuggestion(null)
    setSummary(null)

    try {
      const res = await fetch(API.SUGGEST_SECTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          trip,
          instruction: instruction.trim() || undefined,
          ...extraBody,
        }),
      })

      const data: unknown = await res.json()

      if (!res.ok) {
        const errEnv = ChatErrorEnvelopeSchema.safeParse(data)
        const errMsg = errEnv.success ? errEnv.data.error : 'Ismeretlen hiba.'
        const retryHint = errEnv.success && errEnv.data.retryable ? ' Próbáld újra.' : ''
        setError(errMsg + retryHint)
        return
      }

      const envelope = SuggestSectionEnvelopeSchema.safeParse(data)
      if (envelope.success && validateSuggestion(envelope.data.suggestion)) {
        setSuggestion(envelope.data.suggestion)
        if (envelope.data.summary) {
          setSummary(envelope.data.summary)
        }
      } else {
        setError('Hibás válasz a szervertől.')
      }
    } catch {
      setError('Hálózati hiba. Ellenőrizd az internet kapcsolatot.')
    } finally {
      setLoading(false)
    }
  }

  function handleDiscard() {
    setSuggestion(null)
    setSummary(null)
    setError(null)
  }

  if (suggestion) {
    return (
      <div className="mt-3 border border-purple-200 bg-purple-50/50 rounded-xl p-3 space-y-2">
        <p className="text-xs font-medium text-purple-700">{summary}</p>
        <div className="max-h-48 overflow-y-auto">
          {renderPreview(suggestion)}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { onApply(suggestion); handleDiscard() }} className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
            {applyLabel}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDiscard} className="text-xs h-7">
            Elvetés
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 border border-purple-200 bg-purple-50/50 rounded-xl p-3 space-y-2">
      <p className="text-xs font-medium text-purple-700">AI javaslat</p>
      <input
        type="text"
        value={instruction}
        onChange={e => setInstruction(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !loading && handleGenerate()}
        placeholder="Opcionális instrukció..."
        className="w-full border border-purple-200 rounded-lg px-2 py-1.5 text-sm"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button
        size="sm"
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7"
      >
        {loading ? 'Generálás...' : 'Javaslat kérése'}
      </Button>
    </div>
  )
}
