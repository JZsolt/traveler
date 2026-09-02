import { ROUTES } from '@/lib/constants'
import { LANDING_HERO, LANDING_CTA_SECONDARY } from '@/lib/landingCopy'
import { LandingCta } from './LandingCta'
import type { LandingCtaSectionProps } from '@/types/landing'

// Elso viewport: onmagaban elmagyarazza, mi ez. Pontosan egy elsodleges akcio.
export function LandingHero({ cta, loading }: LandingCtaSectionProps) {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-10 pt-10 pb-12 text-center">
      <p className="text-4xl mb-4">✈️</p>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{LANDING_HERO.title}</h1>
      <p className="text-base text-foreground/80 mb-2">{LANDING_HERO.lead}</p>
      <p className="text-sm text-muted-foreground mb-8">{LANDING_HERO.support}</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <LandingCta cta={cta} loading={loading} className="w-full sm:w-auto" />
        <LandingCta
          cta={{ to: ROUTES.DEMO, label: LANDING_CTA_SECONDARY }}
          tone="secondary"
          className="w-full sm:w-auto"
        />
      </div>
    </section>
  )
}
