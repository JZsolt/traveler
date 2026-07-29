import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { SharedSlugRowSchema } from '@/schemas/sharing'

// Azon trip-slugok halmaza, amelyekhez az owner-nek aktiv (nem visszavont, nem
// lejart) megosztasa van. A "megosztott/privat" badge-hez a My Trips oldalon.
// Owner-scoped, RLS-vedett query — NEM igenyel public trip tabla hozzaferest.
export function useSharedSlugs(): Set<string> {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [slugs, setSlugs] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    let cancelled = false

    void (async () => {
      if (!supabase || !userId) {
        setSlugs(new Set())
        return
      }
      const nowIso = new Date().toISOString()
      const { data, error } = await supabase
        .from('trip_shares')
        .select('trips(slug)')
        .is('revoked_at', null)
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      if (cancelled) return
      if (error) {
        // A badge nem kritikus, de RLS/join/grant gond eseten ne nyeljuk el
        // teljesen — legalabb debugolhato legyen.
        if (import.meta.env.DEV) console.error('[useSharedSlugs] badge query failed', { code: error.code })
        return
      }
      if (!data) return

      const next = new Set<string>()
      for (const raw of data) {
        const parsed = SharedSlugRowSchema.safeParse(raw)
        if (parsed.success) next.add(parsed.data.trips.slug)
      }
      setSlugs(next)
    })()

    return () => { cancelled = true }
  }, [userId])

  return slugs
}
