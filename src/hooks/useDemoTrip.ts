import { useEffect, useState } from 'react'
import { loadDemoTrip } from '@/lib/loadDemoTrip'
import type { DemoTripState } from '@/types/shared'

// A statikus demo utazas betoltese. Nincs halozati keres es nincs Supabase
// fugges — csak egy dinamikus import + Zod validacio, ezert 'notfound' allapot
// sincs: az adat vagy ervenyes, vagy kontrollalt hiba.
export function useDemoTrip(): DemoTripState {
  const [state, setState] = useState<DemoTripState>({ status: 'loading', trip: null })

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const trip = await loadDemoTrip()
        if (cancelled) return
        setState(trip ? { status: 'ok', trip } : { status: 'error', trip: null })
      } catch {
        if (!cancelled) setState({ status: 'error', trip: null })
      }
    }

    queueMicrotask(() => { if (!cancelled) void load() })

    return () => { cancelled = true }
  }, [])

  return state
}
