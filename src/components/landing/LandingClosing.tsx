import { LANDING_CLOSING } from '@/lib/landingCopy'
import { LandingCta } from './LandingCta'
import type { LandingCtaSectionProps } from '@/types/landing'

// Zaro CTA: ugyanaz a cel, mint a heroban, hogy ne kelljen visszagorgetni.
export function LandingClosing({ cta, loading }: LandingCtaSectionProps) {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-10 py-10 text-center">
      <h2 className="text-lg font-semibold text-foreground mb-2">{LANDING_CLOSING.title}</h2>
      <p className="text-sm text-muted-foreground mb-5">{LANDING_CLOSING.desc}</p>
      <LandingCta cta={cta} loading={loading} />
    </section>
  )
}
