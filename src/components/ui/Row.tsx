import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RowProps } from '@/types/ui'

export function Row({ icon, title, subtitle, trailing, onClick, href, className }: RowProps) {
  const interactive = !!(onClick || href)
  const Tag = href ? 'a' : onClick ? 'button' : 'div'

  const content = (
    <>
      {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
      {interactive && !trailing && (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  )

  return (
    <Tag
      className={cn(
        'flex items-center gap-3 px-3 py-3 rounded-lg text-left w-full',
        interactive && 'cursor-pointer active:bg-accent/50 transition-colors',
        className,
      )}
      {...(href ? { href } : {})}
      {...(onClick ? { onClick, type: 'button' as const } : {})}
    >
      {content}
    </Tag>
  )
}
