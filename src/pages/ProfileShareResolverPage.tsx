import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Check, Copy, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Page } from '@/components/ui/Page'
import { InlineError } from '@/components/ui/InlineError'
import { ProfileShareIdSchema } from '@/schemas/profileShare'
import { ROUTES } from '@/lib/constants'
import type { ProfileShareResolverState } from '@/types/profileShare'

export default function ProfileShareResolverPage() {
  const { publicShareId } = useParams<{ publicShareId: string }>()
  const [state, setState] = useState<ProfileShareResolverState>({ copied: false })
  const parsed = ProfileShareIdSchema.safeParse(publicShareId ?? '')

  if (!parsed.success) return <Navigate to={ROUTES.TRIPS} replace />
  const publicId = parsed.data

  function copyId() {
    navigator.clipboard.writeText(publicId).then(() => {
      setState({ copied: true })
      setTimeout(() => setState({ copied: false }), 1500)
    })
  }

  return (
    <Page constrained>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <QrCode className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">Profil QR beolvasva</h1>
            <p className="text-xs text-muted-foreground">
              Ezt az azonosítót egy utazás megosztási ablakában tudod használni. A hozzáférés csak meghívásként jön létre, elfogadás nélkül nem látható az utazás.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={publicId}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 rounded-lg border border-input bg-muted px-2 py-1.5 text-xs font-mono"
          />
          <Button type="button" size="sm" onClick={copyId} aria-label="Profil azonosító másolása">
            {state.copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </Button>
        </div>

        <InlineError message="Ha a tulajdonos később kikapcsolta vagy rotálta ezt a QR-t, a meghívás nem fog létrejönni." />
      </div>
    </Page>
  )
}
