import { Card, CardContent } from '@/components/ui/card'
import { LANDING_HOW_IT_WORKS } from '@/lib/landingCopy'

// Harom lepes, a valodi tervezo folyamat sorrendjeben.
export function LandingHowItWorks() {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-10 py-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">Hogyan működik?</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {LANDING_HOW_IT_WORKS.map((step, idx) => (
          <Card key={step.title}>
            <CardContent className="space-y-1.5">
              <p className="text-2xl">{step.emoji}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {idx + 1}. lépés
              </p>
              <p className="font-medium text-foreground">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
