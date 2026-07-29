import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { useAuth } from '@/hooks/useAuth'
import type { DeleteTripProps, DeleteTripReturn } from '@/types/hooks'

export function useDeleteTrip({ slug, refetch }: DeleteTripProps): DeleteTripReturn {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirmDelete() {
    setDeleting(true)
    setError(null)
    if (!supabase || !slug || !userId) {
      setError(!supabase ? 'Supabase nincs konfigurálva.' : !userId ? 'Bejelentkezes szukseges.' : 'Nincs betöltve az utazás.')
      setDeleting(false)
      return
    }
    const { data, error: err } = await supabase
      .from('trips')
      .delete()
      .eq('slug', slug)
      .eq('owner_id', userId)
      .select('id')
      .maybeSingle()
    if (err) {
      setError(friendlyError(err))
      setDeleting(false)
      return
    }
    if (!data) {
      setError('Az utazas nem talalhato vagy nincs jogosultsagod torolni.')
      setDeleting(false)
      return
    }
    await refetch()
    navigate('/app/trips')
  }

  return {
    showModal,
    openModal: () => setShowModal(true),
    closeModal: () => !deleting && setShowModal(false),
    confirmDelete,
    deleting,
    error,
  }
}
