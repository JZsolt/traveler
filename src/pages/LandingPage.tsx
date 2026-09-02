import { useLandingCta } from '@/hooks/useLandingCta'
import { Page } from '@/components/ui/Page'
import { SharedHeader } from '@/components/shared/SharedHeader'
import { LandingHeaderCta } from '@/components/landing/LandingHeaderCta'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingValue } from '@/components/landing/LandingValue'
import { LandingDemoPreview } from '@/components/landing/LandingDemoPreview'
import { LandingClosing } from '@/components/landing/LandingClosing'
import { LandingFooter } from '@/components/landing/LandingFooter'

// Publikus landing a gyokeren. NINCS TripsProvider es nincs app Header, tehat
// privat trip fetch sem fut; a CTA-k kizarolag az auth session allapotabol
// szarmaznak. Szerkezet: docs/product/LANDING_IA.md
export default function LandingPage() {
  const { primary, header, isLoading } = useLandingCta()

  return (
    <>
      <SharedHeader trailing={<LandingHeaderCta cta={header} loading={isLoading} />} />
      <Page flushTop className="px-0">
        <LandingHero cta={primary} loading={isLoading} />
        <LandingHowItWorks />
        <LandingValue />
        <LandingDemoPreview />
        <LandingClosing cta={primary} loading={isLoading} />
        <LandingFooter />
      </Page>
    </>
  )
}
