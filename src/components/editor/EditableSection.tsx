import { useState } from 'react'
import { SquarePen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DirtyCancelRow } from '@/components/editor/DirtyCancelRow'
import { useAdmin } from '@/hooks/useAdmin'
import type { EditableSectionProps } from '@/types/editor'

export function EditableSection({ title, children, editor, onSave, onCancel, saving, error, canUseAi, onAi, isDirty }: EditableSectionProps) {
  const { isAdminUnlocked } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  function handleEdit() {
    setEditing(true)
    setConfirmCancel(false)
  }

  function handleCancel() {
    if (isDirty && !confirmCancel) {
      setConfirmCancel(true)
      return
    }
    setEditing(false)
    setConfirmCancel(false)
    onCancel?.()
  }

  async function handleSave() {
    if (!onSave) return
    const result = await onSave()
    if (result?.ok !== false) {
      setEditing(false)
      setConfirmCancel(false)
    }
  }

  if (editing) {
    return (
      <div className="py-3">
        {title && (
          <h3 className="text-sm font-bold text-[#1a1a2e] mb-2">{title}</h3>
        )}
        <div className="mb-3">
          {editor}
        </div>
        {error && (
          <p className="text-xs text-red-600 mb-2">{error}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white"
          >
            {saving ? 'Mentés...' : 'Mentés'}
          </Button>
          {confirmCancel ? (
            <DirtyCancelRow show onDiscard={() => { setEditing(false); setConfirmCancel(false); onCancel?.() }} onDismiss={() => setConfirmCancel(false)} />
          ) : (
            <Button
              onClick={handleCancel}
              disabled={saving}
              variant="outline"
              size="sm"
            >
              Mégse
            </Button>
          )}
          {canUseAi && (
            <Button
              onClick={onAi}
              disabled={saving}
              variant="outline"
              size="sm"
              className="sm:ml-auto text-purple-700 border-purple-300 hover:bg-purple-50"
            >
              AI kiegészítés
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="group/section py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-bold text-[#1a1a2e] mb-2">{title}</h3>
          )}
          {children}
        </div>
        {isAdminUnlocked && (
          <button
            onClick={handleEdit}
            aria-label={`${title || 'Szekció'} szerkesztése`}
            className="opacity-100 sm:opacity-0 sm:group-hover/section:opacity-100 focus:opacity-100 transition-opacity shrink-0 text-gray-400 hover:text-[#0f3460] p-1.5 rounded-full hover:bg-slate-100"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
