import { cn } from '@/lib/utils'
import type { SectionProps } from '@/types/ui'

export function Section({ title, eyebrow, action, className, children }: SectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              {eyebrow}
            </p>
          )}
          <h2 className="text-lg font-semibold text-foreground truncate">{title}</h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  )
}
