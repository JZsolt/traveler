import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Page } from '@/components/ui/Page'
import type { SharedTripErrorProps } from '@/types/shared'

// Megkulonboztetett, felhasznalobarat allapot ervenytelen/visszavont/nem talalt
// linkre (notfound) es szerver/halozati hibara (error).
const CONTENT = {
  notfound: {
    emoji: '🔗',
    title: 'Ez a megosztási link nem elérhető',
    desc: 'A link érvénytelen, lejárt, vagy a tulajdonos visszavonta. Kérd el újra attól, akitől kaptad.',
  },
  error: {
    emoji: '😕',
    title: 'Valami hiba történt',
    desc: 'Nem sikerült betölteni a megosztott utazást. Kérlek próbáld újra kicsit később.',
  },
} as const

export function SharedTripError({ variant }: SharedTripErrorProps) {
  const { emoji, title, desc } = CONTENT[variant]

  return (
    <Page flushTop className="px-0">
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <p className="text-5xl mb-4">{emoji}</p>
        <h1 className="text-lg md:text-xl font-bold text-[#1a1a2e] mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{desc}</p>
        <Link
          to={ROUTES.HOME}
          className="inline-block bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Tovább a főoldalra
        </Link>
      </div>
    </Page>
  )
}
