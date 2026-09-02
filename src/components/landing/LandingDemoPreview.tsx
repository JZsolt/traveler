import { Card, CardContent } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/LoadingState'
import { useDemoTrip } from '@/hooks/useDemoTrip'
import { ROUTES } from '@/lib/constants'
import { LANDING_DEMO } from '@/lib/landingCopy'
import { LandingCta } from './LandingCta'

// Az egyetlen trip-formaju tartalom a landingen, es KIZAROLAG a statikus demo
// utazasbol jon (docs/architecture/DEMO_TRIP_STRATEGY.md). Ha nem tolthetoe be,
// a szekcio lefokozodik a demo CTA-ra — a landing attol meg rendereleodik.
export function LandingDemoPreview() {
  const { status, trip } = useDemoTrip()
  const cta = { to: ROUTES.DEMO, label: LANDING_DEMO.cta }

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-10 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
        {LANDING_DEMO.eyebrow}
      </p>
      <h2 className="text-lg font-semibold text-foreground mb-1">{LANDING_DEMO.title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{LANDING_DEMO.desc}</p>

      {status === 'loading' && <LoadingState label="Betöltés..." className="py-8" />}

      {status === 'error' && (
        <p className="text-sm text-muted-foreground mb-4">{LANDING_DEMO.unavailable}</p>
      )}

      {status === 'ok' && trip && (
        <Card className="mb-4">
          <CardContent className="space-y-2">
            <p className="font-medium text-foreground">
              <span className="mr-2">{trip.emoji}</span>
              {trip.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {trip.subtitle} · {trip.people}
            </p>
            <ul className="space-y-1 pt-1">
              {trip.days.map((day) => (
                <li key={day.dayNum} className="text-sm text-foreground/80">
                  <span className="text-muted-foreground mr-2">{day.dayNum}. nap</span>
                  {day.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <LandingCta cta={cta} tone="secondary" />
    </section>
  )
}
