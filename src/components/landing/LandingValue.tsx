import { Card, CardContent } from '@/components/ui/card'
import { LANDING_VALUE_BLOCKS } from '@/lib/landingCopy'

// AI ertek + offline/PWA ertek. Ugyanaz a felepites, ezert egy komponens
// rendereli mindkettot a kozos adatlistabol.
export function LandingValue() {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-10 py-8 space-y-3">
      {LANDING_VALUE_BLOCKS.map((block) => (
        <Card key={block.title}>
          <CardContent className="space-y-2">
            <p className="font-medium text-foreground">
              <span className="mr-2">{block.emoji}</span>
              {block.title}
            </p>
            <ul className="space-y-1.5">
              {block.points.map((point) => (
                <li key={point} className="text-sm text-muted-foreground flex gap-2">
                  <span aria-hidden="true" className="text-foreground/30">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
