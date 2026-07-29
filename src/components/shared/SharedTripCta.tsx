import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

// Opcionalis CTA a megosztott nezet aljan: keszitsd el a sajat utitervedet.
export function SharedTripCta() {
  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white rounded-2xl p-5 text-center">
      <p className="text-sm md:text-base font-bold mb-1">Tetszik ez az útiterv?</p>
      <p className="text-xs opacity-70 mb-4">Készítsd el a sajátodat percek alatt.</p>
      <Link
        to={ROUTES.REGISTER}
        className="inline-block bg-[#e94560] hover:bg-[#d63d56] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
      >
        Saját utazás létrehozása
      </Link>
    </div>
  )
}
