import { cn } from '@/lib/utils'
import type { PageProps } from '@/types/ui'

export function Page({ constrained, className, children }: PageProps) {
  return (
    <main
      className={cn('min-h-dvh bg-background text-foreground pb-16 px-4', className)}
      style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px) + 1.5rem)' }}
    >
      {constrained ? (
        <div className="max-w-lg mx-auto">{children}</div>
      ) : (
        children
      )}
    </main>
  )
}
