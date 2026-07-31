import { Briefcase, Inbox, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DashboardTabConfig, DashboardTabsProps } from '@/types/shared'

const TABS: DashboardTabConfig[] = [
  { id: 'owned', label: 'Saját utazásaim', icon: Briefcase },
  { id: 'shared', label: 'Megosztva velem', icon: Share2 },
  { id: 'invites', label: 'Meghívások', icon: Inbox },
]

export function DashboardTabs({ active, ownedCount, sharedCount, inviteCount, onChange }: DashboardTabsProps) {
  const counts = { owned: ownedCount, shared: sharedCount, invites: inviteCount }

  return (
    <div className="mb-5 grid grid-cols-3 rounded-xl border border-border bg-muted/40 p-1">
      {TABS.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          variant={active === id ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onChange(id)}
          className="min-w-0 gap-1.5 px-2"
          aria-pressed={active === id}
          aria-label={label}
        >
          <Icon className="size-3.5" />
          <span className="hidden min-w-0 truncate sm:inline">{label}</span>
          <span className="text-xs text-muted-foreground">{counts[id]}</span>
        </Button>
      ))}
    </div>
  )
}
