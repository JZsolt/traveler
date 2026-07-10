import { ScheduleItem } from '@/components/ScheduleItem'
import { Button } from '@/components/ui/button'
import { Timeline } from '@/components/ui/Timeline'
import { addScheduleItem, deleteScheduleItem, moveScheduleItem, updateScheduleItem } from '@/lib/tripSections'
import type { DayScheduleProps } from '@/types/components'
import { DayScheduleActions } from './DayScheduleActions'
import { DayScheduleAiPanel } from './DayScheduleAiPanel'

export function DaySchedule({
  day,
  trip,
  activeSchedule,
  scheduleAi,
  saveTrip,
  saving,
  error,
  isAdminUnlocked,
}: DayScheduleProps) {
  return (
    <div>
      {scheduleAi.pendingDraft && (
        <div className="mb-3 border border-purple-200 bg-purple-50/50 rounded-xl p-3 space-y-2">
          <p className="text-xs font-medium text-purple-700">AI javaslat alkalmazva — még nincs mentve!</p>
          <div className="flex gap-2">
            <Button onClick={scheduleAi.saveDraft} disabled={saving} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
              {saving ? 'Mentés...' : 'Mentés'}
            </Button>
            <Button onClick={scheduleAi.discardDraft} variant="outline" size="sm" className="text-xs h-7">
              Visszavonás
            </Button>
          </div>
        </div>
      )}
      <Timeline>
        {activeSchedule.map((item, i) => (
          <ScheduleItem
            key={i}
            item={item}
            isFirst={i === 0}
            isLast={i === activeSchedule.length - 1}
            saving={saving}
            error={error}
            trip={trip}
            dayNum={day.dayNum}
            itemIndex={i}
            onSave={scheduleAi.pendingDraft ? undefined : (updates => saveTrip(t => updateScheduleItem(t, day.dayNum, i, updates)))}
            onMoveUp={scheduleAi.pendingDraft ? undefined : (() => saveTrip(t => moveScheduleItem(t, day.dayNum, i, -1)))}
            onMoveDown={scheduleAi.pendingDraft ? undefined : (() => saveTrip(t => moveScheduleItem(t, day.dayNum, i, 1)))}
            onDelete={scheduleAi.pendingDraft ? undefined : (() => saveTrip(t => deleteScheduleItem(t, day.dayNum, i)))}
            readOnly={!!scheduleAi.pendingDraft || !isAdminUnlocked}
          />
        ))}
      </Timeline>
      {isAdminUnlocked && (
        <DayScheduleActions
          saving={saving}
          pending={!!scheduleAi.pendingDraft}
          onAdd={() => saveTrip(t => addScheduleItem(t, day.dayNum))}
          onAi={scheduleAi.togglePanel}
        />
      )}
      <DayScheduleAiPanel scheduleAi={scheduleAi} />
    </div>
  )
}
