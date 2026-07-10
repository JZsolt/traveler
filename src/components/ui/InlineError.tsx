import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InlineErrorProps } from '@/types/ui'

export function InlineError({ message, onRetry, className }: InlineErrorProps) {
  return (
    <div role="alert" className={cn('flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5', className)}>
      <AlertCircle className="size-4 shrink-0 text-destructive" />
      <p className="flex-1 text-sm text-destructive">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-xs font-medium text-destructive underline underline-offset-2"
        >
          Újra
        </button>
      )}
    </div>
  )
}
