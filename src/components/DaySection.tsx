import { useState } from 'react'
import { CostTable } from './CostTable'
import { AlertBox } from './AlertBox'
import { TransportOptions } from './TransportOptions'
import { DayAdvancedDataEditor } from './day/DayAdvancedDataEditor'
import { DayHeader } from './day/DayHeader'
import { DayImages } from './day/DayImages'
import { DayTickets } from './day/DayTickets'
import { DayDeleteConfirm } from './day/DayDeleteConfirm'
import { DaySchedule } from './day/DaySchedule'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { useAdmin } from '@/hooks/useAdmin'
import { useDayMetaEditor } from '@/hooks/useDayMetaEditor'
import { useDayAdvancedEditor } from '@/hooks/useDayAdvancedEditor'
import { useDayScheduleAi } from '@/hooks/useDayScheduleAi'
import { updateTripDay, moveDayUp, moveDayDown, deleteDay } from '@/lib/tripSections'
import type { DaySectionProps } from '@/types/components'
import type { Image } from '@/types/trip'

export function DaySection({ day, trip, slug, refetch, isFirst, isLast }: DaySectionProps) {
  const { isAdminUnlocked } = useAdmin()
  const [open, setOpen] = useState(false)
  const [lightbox, setLightbox] = useState<Image | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  const meta = useDayMetaEditor({ day, saveTrip, updateTripDay })
  const advanced = useDayAdvancedEditor({ day, saveTrip, updateTripDay })
  const scheduleAi = useDayScheduleAi({ day, trip, saveTrip, updateTripDay })

  const activeSchedule = scheduleAi.pendingDraft?.schedule || day.schedule || []

  return (
    <div className="border-b border-slate-200/60">
      <DayHeader
        day={day}
        trip={trip}
        meta={meta}
        saving={saving}
        error={error}
        isAdminUnlocked={isAdminUnlocked}
        isFirst={isFirst}
        isLast={isLast}
        hasPendingScheduleDraft={!!scheduleAi.pendingDraft}
        open={open}
        onToggleOpen={() => setOpen(current => !current)}
        onMoveUp={() => saveTrip(t => moveDayUp(t, day.dayNum))}
        onMoveDown={() => saveTrip(t => moveDayDown(t, day.dayNum))}
        onDeleteRequest={() => setConfirmDelete(true)}
      />

      {confirmDelete && (
        <DayDeleteConfirm
          dayNum={day.dayNum}
          saving={saving}
          onConfirm={() => { saveTrip(t => deleteDay(t, day.dayNum)); setConfirmDelete(false) }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {open && (
        <div className="px-4 md:px-12 pb-5">
          <DayImages images={day.images} lightbox={lightbox} onOpen={setLightbox} onClose={() => setLightbox(null)} />
          <DayTickets tickets={day.tickets} />

          {day.alerts?.map((alert, i) => <AlertBox key={i} type={alert.type} text={alert.text} />)}

          {day.transportOptions && <TransportOptions data={day.transportOptions} people={trip.people} />}

          <DaySchedule
            day={day}
            trip={trip}
            activeSchedule={activeSchedule}
            scheduleAi={scheduleAi}
            saveTrip={saveTrip}
            saving={saving}
            error={error}
            isAdminUnlocked={isAdminUnlocked}
          />

          {isAdminUnlocked && <DayAdvancedDataEditor advanced={advanced} saving={saving} error={error} />}

          {day.costs && <CostTable costs={day.costs} people={trip.people} />}

          {day.endAlerts?.map((alert, i) => <AlertBox key={i} type={alert.type} text={alert.text} url={alert.url} />)}
        </div>
      )}
    </div>
  )
}
