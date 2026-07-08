import type { DayScheduleActionsProps } from '@/types/components'

export function DayScheduleActions({ saving, pending, onAdd, onAi }: DayScheduleActionsProps) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <button onClick={onAdd} disabled={saving || pending} className="text-xs text-slate-400 hover:text-[#0f3460] hover:bg-slate-100 px-2 py-1 rounded-full transition-colors disabled:opacity-50">
        + Új program
      </button>
      <button onClick={onAi} disabled={pending} className="text-xs text-purple-500 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded-full transition-colors disabled:opacity-50">
        AI programterv
      </button>
    </div>
  )
}
