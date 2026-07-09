import { useNavigate } from 'react-router-dom'
import { useEditTrip } from '@/hooks/useEditTrip'
import { useDeleteTrip } from '@/hooks/useDeleteTrip'
import type { EditTripFormPanelProps } from '@/types/pages'

export function EditTripFormPanel({ trip, slug, refetch }: EditTripFormPanelProps) {
  const navigate = useNavigate()
  const edit = useEditTrip({ trip, slug, refetch, navigate })
  const del = useDeleteTrip({ slug, refetch })

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Utazas szerkesztese</h1>

      <form onSubmit={edit.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cim *</label>
          <input
            type="text"
            required
            value={edit.form.title}
            onChange={e => edit.update('title', e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kezdés *</label>
            <input
              type="date"
              required
              value={edit.form.startDate}
              onChange={e => edit.update('startDate', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vége *</label>
            <input
              type="date"
              required
              value={edit.form.endDate}
              onChange={e => edit.update('endDate', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
          <input
            type="text"
            value={edit.form.emoji}
            onChange={e => edit.update('emoji', e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Utazok</label>
          <input
            type="text"
            value={edit.form.people}
            onChange={e => edit.update('people', e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
          />
        </div>

        {(edit.error || del.error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {edit.error || del.error}
          </div>
        )}

        <button
          type="submit"
          disabled={edit.saving || del.deleting}
          className="w-full bg-[#0f3460] text-white font-semibold py-3 rounded-xl hover:bg-[#1a1a2e] transition-colors disabled:opacity-50 text-base"
        >
          {edit.saving ? 'Mentes...' : 'Valtozasok mentese'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        {!del.showModal ? (
          <button
            onClick={del.openModal}
            disabled={edit.saving || del.deleting}
            className="w-full bg-white text-red-600 border border-red-300 font-semibold py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Utazas torlese
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-red-800 font-medium">
              Biztosan torolni akarod ezt az utazast? Ez a muvelet vegleges es nem vonhato vissza.
            </p>
            <div className="flex gap-3">
              <button
                onClick={del.confirmDelete}
                disabled={del.deleting}
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {del.deleting ? 'Torles...' : 'Igen, torold'}
              </button>
              <button
                onClick={del.closeModal}
                disabled={del.deleting}
                className="flex-1 bg-white text-gray-700 border border-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Megse
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
