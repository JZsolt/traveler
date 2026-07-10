import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LoadingStateProps } from '@/types/ui'

export function LoadingState({ label = 'Betöltés...', className }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className={cn('flex flex-col items-center justify-center py-16 text-muted-foreground', className)}>
      <Loader2 className="size-5 animate-spin mb-2" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
