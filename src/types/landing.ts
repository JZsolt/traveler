import type { ReactNode } from 'react'

export interface LandingStep {
  emoji: string
  title: string
  desc: string
}

export interface LandingValueBlock {
  emoji: string
  title: string
  points: string[]
}

export interface LandingCtaTarget {
  to: string
  label: string
}

// A landing CTA-i kizarolag az auth session allapotabol szarmaznak — a landing
// SOHA nem tolti be a latogato utazasait, hogy eldontse, mit mutasson.
export interface LandingCtaState {
  isLoading: boolean
  primary: LandingCtaTarget
  header: LandingCtaTarget
}

export interface LandingCtaProps {
  cta: LandingCtaTarget
  loading?: boolean
  tone?: 'primary' | 'secondary'
  className?: string
}

export interface LandingCtaSectionProps {
  cta: LandingCtaTarget
  loading: boolean
}

export interface LandingSectionProps {
  children: ReactNode
  className?: string
}
