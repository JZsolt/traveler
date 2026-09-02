import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { LANDING_FOOTER } from '@/lib/landingCopy'

// Minimalis lablec: marka + demo link. Nincs admin, nincs belso route.
export function LandingFooter() {
  return (
    <footer className="max-w-3xl mx-auto px-4 md:px-10 py-8 border-t border-foreground/10">
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>{LANDING_FOOTER.brand}</span>
        <Link to={ROUTES.DEMO} className="text-primary hover:underline">
          {LANDING_FOOTER.demoLink}
        </Link>
      </div>
    </footer>
  )
}
