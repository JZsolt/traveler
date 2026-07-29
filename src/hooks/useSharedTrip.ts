import { useEffect, useState } from 'react'
import { API } from '@/lib/constants'
import { PublicSharedTripResponseSchema } from '@/schemas/sharing'
import type { SharedTripState } from '@/types/shared'

// Public, anonim trip lekeres a megosztasi token alapjan. A token a POST body-ban
// megy (kimarad az URL/CDN logokbol), a valasz Zod-dal validalodik. A betoltest
// queueMicrotask-kal inditjuk, igy a setState-ek az effect body-n KIVUL, egy
// microtaskban futnak (nincs szinkron effect-setState / kaszkadolo re-render).
export function useSharedTrip(token: string | undefined): SharedTripState {
  const [state, setState] = useState<SharedTripState>(() =>
    token ? { status: 'loading', trip: null } : { status: 'notfound', trip: null },
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!token) {
        setState({ status: 'notfound', trip: null })
        return
      }
      setState({ status: 'loading', trip: null })
      try {
        const res = await fetch(API.SHARED_TRIP, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        if (cancelled) return

        if (res.status === 404) {
          setState({ status: 'notfound', trip: null })
          return
        }
        if (!res.ok) {
          setState({ status: 'error', trip: null })
          return
        }

        const data: unknown = await res.json()
        if (cancelled) return

        const parsed = PublicSharedTripResponseSchema.safeParse(data)
        if (!parsed.success) {
          setState({ status: 'error', trip: null })
          return
        }
        setState({ status: 'ok', trip: parsed.data.trip })
      } catch {
        if (!cancelled) setState({ status: 'error', trip: null })
      }
    }

    queueMicrotask(() => { if (!cancelled) void load() })

    return () => { cancelled = true }
  }, [token])

  return state
}
