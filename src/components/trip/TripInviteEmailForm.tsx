import { Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { useTripInviteEmail } from '@/hooks/useTripInviteEmail'
import type { TripInviteEmailFormProps } from '@/types/emailInvites'

export function TripInviteEmailForm({ slug }: TripInviteEmailFormProps) {
  const emailInvite = useTripInviteEmail({ slug })

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
        <Mail className="size-3.5" /> Email meghívó
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={emailInvite.email}
          onChange={(e) => emailInvite.setEmail(e.target.value)}
          placeholder="email@pelda.hu"
          className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
        />
        <Button
          type="button"
          size="sm"
          onClick={emailInvite.send}
          disabled={emailInvite.busy}
          className="shrink-0"
          aria-label="Email meghívó küldése"
        >
          <Send className="size-3.5" />
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        A levél public, csak olvasható linket tartalmaz. App felhasználónál külön elfogadandó meghívás is létrejön.
      </p>
      {emailInvite.message && <p className="text-xs text-muted-foreground">{emailInvite.message}</p>}
      {emailInvite.error && <InlineError message={emailInvite.error} />}
    </div>
  )
}
