import { Link } from 'react-router-dom'
import { LANDING_CTA_LOADING } from '@/lib/landingCopy'
import type { LandingCtaSectionProps } from '@/types/landing'

// A fejlec CTA-ja a sotet SharedHeader savban ul, ezert nem a LandingCta
// tonusait hasznalja. Session betoltes alatt itt is neutralis felirat megy ki.
export function LandingHeaderCta({ cta, loading }: LandingCtaSectionProps) {
  if (loading) {
    return <span aria-busy="true" className="text-xs text-white/50">{LANDING_CTA_LOADING}</span>
  }

  return (
    <Link to={cta.to} className="text-xs font-semibold text-white/80 hover:text-white no-underline">
      {cta.label}
    </Link>
  )
}
