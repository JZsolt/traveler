import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TimelineProps, TimelineItemProps } from '@/types/ui';

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn('flex flex-col', className)}>{children}</div>;
}

export function TimelineItem({
  time,
  title,
  description,
  badges,
  highlight,
  actions,
  className,
}: TimelineItemProps) {
  return (
    <div
      className={cn(
        'flex gap-2 py-3',
        highlight
          ? 'bg-traveler-accent/10 px-4 -mx-4 border-l-[3px] border-traveler-accent'
          : 'border-b border-border',
        className,
      )}
    >
      <span className='text-[11px] text-muted-foreground font-semibold tabular-nums shrink-0 w-11 pt-0.5'>
        {time}
      </span>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-1.5 flex-wrap'>
          <span className='font-bold text-[15px] text-foreground leading-snug'>
            {title}
          </span>
          {badges?.map((b, i) => (
            <Badge
              key={`${b}-${i}`}
              variant='outline'
              className='text-[10px] font-semibold py-0 px-1.5'
            >
              {b}
            </Badge>
          ))}
        </div>
        {description && (
          <p className='text-[13px] text-muted-foreground leading-relaxed mt-0.5'>
            {description}
          </p>
        )}
        {actions && <div className='mt-2'>{actions}</div>}
      </div>
    </div>
  );
}
