import { useAuth } from '@/hooks/useAuth'
import { resolveLandingCta } from '@/lib/landingCta'
import type { LandingCtaState } from '@/types/landing'

// A landing csak az auth session allapotat olvassa; a dontes maga a
// resolveLandingCta tiszta fuggvenyben el, es ott is van tesztelve.
export function useLandingCta(): LandingCtaState {
  const { user, isLoading } = useAuth()
  return resolveLandingCta(!!user, isLoading)
}
