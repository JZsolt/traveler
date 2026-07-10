import { DirtyCancelRow } from '@/components/editor/DirtyCancelRow'
import { Button } from '@/components/ui/button'
import type { DayAdvancedDataEditorProps } from '@/types/components'

export function DayAdvancedDataEditor({ advanced, saving, error }: DayAdvancedDataEditorProps) {
  return (
    <details className="mt-4 mb-2">
      <summary className="text-[11px] text-slate-400 cursor-pointer hover:text-slate-600">Haladó nap adatok</summary>
      {advanced.editing && advanced.draft ? (
        <div className="mt-2 space-y-3">
          {advanced.fields.map(field => (
            <div key={field}>
              <label className="text-[10px] font-medium text-slate-500">{field}</label>
              <textarea value={advanced.draft![field]} onChange={e => advanced.updateField(field, e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono resize-y" />
              {advanced.errors[field] && <p className="text-[10px] text-red-500">{advanced.errors[field]}</p>}
            </div>
          ))}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={advanced.save} disabled={saving} size="sm" className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-xs h-7">
              {saving ? 'Mentés...' : 'Mentés'}
            </Button>
            {advanced.confirmCancel ? (
              <DirtyCancelRow show onDiscard={advanced.cancel} onDismiss={advanced.dismissCancel} />
            ) : (
              <Button onClick={advanced.cancel} variant="outline" size="sm" className="text-xs h-7">
                Mégse
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <button onClick={advanced.startEdit} className="text-[11px] text-[#0f3460] hover:underline">
            Szerkesztés
          </button>
        </div>
      )}
    </details>
  )
}
