import { Check, Inbox, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { InlineError } from '@/components/ui/InlineError'
import { LoadingState } from '@/components/ui/LoadingState'
import type { PendingInviteCardProps, PendingInvitesSectionProps } from '@/types/shared'

function PendingInviteCard({ invite, busy, onAccept, onDecline }: PendingInviteCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
          {invite.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{invite.title}</p>
          <p className="text-xs text-muted-foreground">{invite.subtitle}</p>
          {invite.destination && <p className="mt-1 text-xs text-muted-foreground">{invite.destination}</p>}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button type="button" size="sm" onClick={() => onAccept(invite.inviteId)} disabled={busy}>
          <Check className="size-3.5" /> Elfogadás
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onDecline(invite.inviteId)} disabled={busy}>
          <X className="size-3.5" /> Elutasítás
        </Button>
      </div>
    </div>
  )
}

export function PendingInvitesSection({
  invites,
  loading,
  error,
  unavailableCount,
  busyInviteId,
  onAccept,
  onDecline,
  onRetry,
}: PendingInvitesSectionProps) {
  if (loading) return <LoadingState label="Meghívások betöltése..." className="py-16" />

  return (
    <div className="space-y-4">
      {error && <InlineError message={error} onRetry={onRetry} />}
      {unavailableCount > 0 && (
        <InlineError message={`${unavailableCount} meghívás vagy megosztás jelenleg nem elérhető.`} onRetry={onRetry} />
      )}
      {!error && invites.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-10 h-10" />}
          title="Nincs függő meghívás"
          description="Az új megosztási meghívások itt jelennek meg."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invites.map((invite) => (
            <PendingInviteCard
              key={invite.inviteId}
              invite={invite}
              busy={busyInviteId === invite.inviteId}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          ))}
        </div>
      )}
    </div>
  )
}
