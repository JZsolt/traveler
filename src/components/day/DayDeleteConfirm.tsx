import { Button } from '@/components/ui/button'
import type { DayDeleteConfirmProps } from '@/types/components'

export function DayDeleteConfirm({ dayNum, saving, onConfirm, onCancel }: DayDeleteConfirmProps) {
  return (
    <div className="mx-3 md:mx-8 mb-2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
      <p className="text-xs text-red-700 flex-1">Biztosan törlöd a {dayNum}. napot?</p>
      <Button onClick={onConfirm} disabled={saving} size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs h-7">
        Törlés
      </Button>
      <Button onClick={onCancel} variant="outline" size="sm" className="text-xs h-7">
        Mégse
      </Button>
    </div>
  )
}
