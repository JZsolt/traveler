import { Check, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { useProfileQrInvite } from '@/hooks/useProfileQrInvite'
import type { ProfileQrInviteFormProps } from '@/types/shared'

export function ProfileQrInviteForm({ slug }: ProfileQrInviteFormProps) {
  const inviteForm = useProfileQrInvite({ slug })

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
      <p className="text-xs font-semibold text-foreground">App felhasználó meghívása profil QR alapján</p>
      <div className="flex gap-2">
        <input
          value={inviteForm.input}
          onChange={(e) => inviteForm.setInput(e.target.value)}
          placeholder="Profil QR link vagy azonosító"
          className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
        />
        <Button
          type="button"
          size="sm"
          onClick={inviteForm.invite}
          disabled={inviteForm.busy}
          className="shrink-0"
          aria-label="Profil QR meghívó küldése"
        >
          {inviteForm.message?.startsWith('Meghívás elküldve') ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
        </Button>
      </div>
      {inviteForm.message && <p className="text-xs text-muted-foreground">{inviteForm.message}</p>}
      {inviteForm.error && <InlineError message={inviteForm.error} />}
    </div>
  )
}
