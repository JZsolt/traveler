import { ROUTES } from '@/lib/constants'
import {
  LANDING_CTA_ANONYMOUS,
  LANDING_CTA_AUTHENTICATED,
  LANDING_CTA_LOADING,
  LANDING_CTA_LOGIN,
} from '@/lib/landingCopy'
import type { LandingCtaState } from '@/types/landing'

// Tiszta dontesi fuggveny: a landing CTA-i KIZAROLAG az auth session allapotabol
// szarmaznak — nincs benne trip lekeres. Amig a session tolt, neutralis felirat
// megy ki, hogy ne villanjon fel rossz CTA (docs/product/LANDING_IA.md 5).
export function resolveLandingCta(hasUser: boolean, isLoading: boolean): LandingCtaState {
  if (isLoading) {
    return {
      isLoading: true,
      primary: { to: ROUTES.DEMO, label: LANDING_CTA_LOADING },
      header: { to: ROUTES.DEMO, label: LANDING_CTA_LOADING },
    }
  }

  if (hasUser) {
    return {
      isLoading: false,
      primary: { to: ROUTES.TRIPS, label: LANDING_CTA_AUTHENTICATED },
      header: { to: ROUTES.TRIPS, label: LANDING_CTA_AUTHENTICATED },
    }
  }

  return {
    isLoading: false,
    primary: { to: ROUTES.REGISTER, label: LANDING_CTA_ANONYMOUS },
    header: { to: ROUTES.LOGIN, label: LANDING_CTA_LOGIN },
  }
}
