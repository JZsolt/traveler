import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LANDING_CTA_LOADING } from '@/lib/landingCopy'
import type { LandingCtaProps } from '@/types/landing'

// Megosztott CTA a landing minden pontjara (fejlec, hero, demo szekcio, zaras).
// Theme tokeneket hasznal, nem hard-coded szineket. Amig az auth session tolt,
// nem linket, hanem azonos meretu, nem kattinthato placeholdert rendereluenk —
// igy nem villan fel rossz CTA felirat (LANDING_IA.md 5).
const TONE_CLASS = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm',
  secondary: 'bg-background text-foreground ring-1 ring-foreground/15 hover:bg-muted',
} as const

const BASE_CLASS =
  'inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition-colors'

export function LandingCta({ cta, loading = false, tone = 'primary', className }: LandingCtaProps) {
  if (loading) {
    return (
      <span aria-busy="true" className={cn(BASE_CLASS, TONE_CLASS[tone], 'opacity-60', className)}>
        {LANDING_CTA_LOADING}
      </span>
    )
  }

  return (
    <Link to={cta.to} className={cn(BASE_CLASS, TONE_CLASS[tone], className)}>
      {cta.label}
    </Link>
  )
}
