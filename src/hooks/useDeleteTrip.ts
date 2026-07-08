import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import type { DeleteTripProps, DeleteTripReturn } from '@/types/hooks'

export function useDeleteTrip({ slug, refetch }: DeleteTripProps): DeleteTripReturn {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirmDelete() {
    setDeleting(true)
    setError(null)
    if (!supabase) {
      setError('Supabase nincs konfigurálva.')
      setDeleting(false)
      return
    }
    const { error: err } = await supabase.from('trips').delete().eq('slug', slug)
    if (err) {
      setError(friendlyError(err))
      setDeleting(false)
      return
    }
    await refetch()
    navigate('/')
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
