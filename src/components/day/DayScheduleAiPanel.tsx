import { Button } from '@/components/ui/button'
import type { DayScheduleAiPanelProps } from '@/types/components'

export function DayScheduleAiPanel({ scheduleAi }: DayScheduleAiPanelProps) {
  if (!scheduleAi.showPanel) return null

  return (
    <div className="mt-2 border border-purple-200 bg-purple-50/50 rounded-xl p-3 space-y-2">
      {scheduleAi.preview ? (
        <>
          <p className="text-xs font-medium text-purple-700">
            Javasolt programterv ({scheduleAi.preview.schedule?.length || 0} program)
          </p>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {(scheduleAi.preview.schedule || []).map((s, i) => (
              <div key={i} className="text-xs text-slate-700 flex gap-2 py-0.5">
                <span className="text-slate-400 tabular-nums w-10 shrink-0">{s.time}</span>
                <span className="font-medium">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={scheduleAi.applyPreview} className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
              Alkalmazás
            </Button>
            <Button size="sm" variant="outline" onClick={scheduleAi.clearPreview} className="text-xs h-7">
              Elvetés
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs font-medium text-purple-700">AI napi programterv generálás</p>
          <input
            type="text"
            value={scheduleAi.instruction}
            onChange={e => scheduleAi.setInstruction(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !scheduleAi.loading && scheduleAi.generate()}
            placeholder="Opcionális instrukció (pl. 'több múzeum', 'laza tempó')..."
            className="w-full border border-purple-200 rounded-lg px-2 py-1.5 text-sm"
          />
          {scheduleAi.error && <p className="text-xs text-red-600">{scheduleAi.error}</p>}
          <Button size="sm" onClick={scheduleAi.generate} disabled={scheduleAi.loading} className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
            {scheduleAi.loading ? 'Generálás...' : 'Programterv kérése'}
          </Button>
        </>
      )}
    </div>
  )
}
