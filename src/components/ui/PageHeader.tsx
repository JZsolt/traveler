import { cn } from '@/lib/utils'
import type { PageHeaderProps } from '@/types/ui'

export function PageHeader({ title, subtitle, leading, trailing, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start gap-3 mb-6', className)}>
      {leading && <div className="shrink-0 pt-0.5">{leading}</div>}
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0 pt-0.5">{trailing}</div>}
    </div>
  )
}
