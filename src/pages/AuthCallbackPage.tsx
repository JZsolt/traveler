import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { LoadingState } from '@/components/ui/LoadingState'
import { InlineError } from '@/components/ui/InlineError'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return

    const client = supabase
    let handled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const route = (target: string) => {
      if (handled) return
      handled = true
      navigate(target, { replace: true })
    }

    const checkSession = async () => {
      const hash = window.location.hash
      const isRecovery = hash.includes('type=recovery')

      if (isRecovery) {
        route('/reset-password')
        return
      }

      const { data: { session }, error: sessionError } = await client.auth.getSession()
      if (handled) return

      if (sessionError) {
        setError('A munkamenet feldolgozasa sikertelen.')
        return
      }
      if (session) {
        route('/app/trips')
        return
      }

      timeoutId = setTimeout(() => {
        if (!handled) setError('A munkamenet feldolgozasa idotullepesbe futott.')
      }, 5000)
    }

    const { data: { subscription } } = client.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        route('/reset-password')
      } else if (event === 'SIGNED_IN') {
        route('/app/trips')
      }
    })

    void checkSession()

    return () => {
      handled = true
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [navigate])

  if (!supabase) {
    return (
      <Page constrained className="pt-20">
        <InlineError message="Supabase nincs konfigurálva." />
      </Page>
    )
  }

  if (error) {
    return (
      <Page constrained className="pt-20">
        <InlineError message={error} onRetry={() => navigate('/login', { replace: true })} />
      </Page>
    )
  }

  return (
    <Page constrained className="pt-20">
      <LoadingState label="Feldolgozas..." />
    </Page>
  )
}
