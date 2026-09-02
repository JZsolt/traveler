import { describe, it, expect } from 'vitest'
import { resolveLandingCta } from '../landingCta'
import { ROUTES } from '@/lib/constants'
import {
  LANDING_CTA_ANONYMOUS,
  LANDING_CTA_AUTHENTICATED,
  LANDING_CTA_LOADING,
  LANDING_CTA_LOGIN,
} from '@/lib/landingCopy'

describe('resolveLandingCta', () => {
  it('shows a neutral label while the session is resolving', () => {
    // Flicker-vedelem: tolteskor sem az anonim, sem a belepett felirat nem
    // szivaroghat ki, fuggetlenul attol, van-e mar user objektum.
    for (const hasUser of [false, true]) {
      const state = resolveLandingCta(hasUser, true)
      expect(state.isLoading).toBe(true)
      expect(state.primary.label).toBe(LANDING_CTA_LOADING)
      expect(state.header.label).toBe(LANDING_CTA_LOADING)
    }
  })

  it('points anonymous visitors to register and login', () => {
    const state = resolveLandingCta(false, false)
    expect(state.isLoading).toBe(false)
    expect(state.primary).toEqual({ to: ROUTES.REGISTER, label: LANDING_CTA_ANONYMOUS })
    expect(state.header).toEqual({ to: ROUTES.LOGIN, label: LANDING_CTA_LOGIN })
  })

  it('points authenticated visitors to the app', () => {
    const state = resolveLandingCta(true, false)
    expect(state.isLoading).toBe(false)
    expect(state.primary).toEqual({ to: ROUTES.TRIPS, label: LANDING_CTA_AUTHENTICATED })
    expect(state.header).toEqual({ to: ROUTES.TRIPS, label: LANDING_CTA_AUTHENTICATED })
  })

  it('never routes a landing CTA to a parameterized route path', () => {
    // A CTA-k konkret utvonalra mutatnak, nem route mintara (pl. /app/trips/:slug).
    const states = [resolveLandingCta(false, false), resolveLandingCta(true, false)]
    for (const state of states) {
      expect(state.primary.to).not.toContain(':')
      expect(state.header.to).not.toContain(':')
    }
  })
})
