import type { LandingStep, LandingValueBlock } from '@/types/landing'

// A publikus landing (/) minden ismetelt szovege. Nem komponensbe hardcode-olva.
// A szerkezetet a docs/product/LANDING_IA.md rogziti.

export const LANDING_HERO = {
  title: 'Az Utazásaim',
  lead: 'Személyes, AI-val segített útitervező. Egy ötletből percek alatt lesz használható napi program.',
  support: 'Minden egy helyen: látnivalók, étkezés, térképek, költségek — indulás előtt és útközben is.',
} as const

export const LANDING_HOW_IT_WORKS: LandingStep[] = [
  {
    emoji: '🗺',
    title: 'Mondd el, hova mennél',
    desc: 'Úti cél, dátum, hányan mentek, mennyi a keret és milyen tempót szeretnél.',
  },
  {
    emoji: '✨',
    title: 'Elkészül az útiterv',
    desc: 'Napról napra: programok, étkezés, térképlinkek és becsült költségek.',
  },
  {
    emoji: '✏️',
    title: 'Alakítsd magadra',
    desc: 'Minden generált részlet kézzel szerkeszthető, semmi nem véglegesített.',
  },
]

export const LANDING_VALUE_BLOCKS: LandingValueBlock[] = [
  {
    emoji: '🤖',
    title: 'Az AI segít, nem helyettesít',
    points: [
      'Az AI megírja az első verziót, és bármelyik programot újragondolja, ha kéred.',
      'Semmi nem mentődik automatikusan — a döntés mindig a tiéd.',
      'Az útiterv a felület, nem egy chatablak.',
    ],
  },
  {
    emoji: '📶',
    title: 'Útközben is működik',
    points: [
      'Telepíthető a kezdőképernyőre, és úgy viselkedik, mint egy alkalmazás.',
      'A mentett útiterv a helyszínen is elérhető marad, gyenge térerővel is.',
      'A térképek, linkek és leírások előre összegyűlnek — nem kell újra keresgélni.',
    ],
  },
]

export const LANDING_DEMO = {
  eyebrow: 'Példa',
  title: 'Nézd meg élesben',
  desc: 'Egy kész útiterv, pontosan úgy, ahogy a sajátod is kinézne.',
  cta: 'Teljes példa megnyitása',
  unavailable: 'A példa útiterv most nem érhető el, de megnyithatod a demó oldalon.',
} as const

export const LANDING_CLOSING = {
  title: 'Kezdd el a következő utad',
  desc: 'Az első útiterved öt percen belül készen lehet.',
} as const

export const LANDING_FOOTER = {
  brand: 'Az Utazásaim',
  demoLink: 'Bemutató útiterv',
} as const

export const LANDING_CTA_ANONYMOUS = 'Kezdjük'
export const LANDING_CTA_AUTHENTICATED = 'Az utazásaim'
export const LANDING_CTA_SECONDARY = 'Nézd meg egy példán'
export const LANDING_CTA_LOGIN = 'Belépés'
export const LANDING_CTA_LOADING = 'Betöltés...'
