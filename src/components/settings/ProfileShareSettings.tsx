import { useState } from 'react'
import { Ban, Check, Copy, RefreshCw, UserRoundCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { LoadingState } from '@/components/ui/LoadingState'
import { useProfileShare } from '@/hooks/useProfileShare'
import { ShareQrCode } from '@/components/trip/ShareQrCode'
import type { ProfileShareSettingsProps } from '@/types/profileShare'

export function ProfileShareSettings({ profileName }: ProfileShareSettingsProps) {
  const profileShare = useProfileShare()
  const [copied, setCopied] = useState(false)

  function copyLink() {
    if (!profileShare.profileShareUrl) return
    navigator.clipboard.writeText(profileShare.profileShareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <UserRoundCheck className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground">Profil QR megosztás</h2>
          <p className="text-xs text-muted-foreground">
            Opt-in azonosító app felhasználóknak. Nem tartalmaz email címet, és csak függő meghívást hozhat létre.
          </p>
        </div>
      </div>

      {profileShare.loading ? (
        <LoadingState label="Profil QR betöltése..." className="py-6" />
      ) : profileShare.profileShareUrl ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Aktív {profileName ? `(${profileName})` : ''}. Ha valaki beolvassa, csak meghívást tud küldeni; az utazás elfogadás után jelenik meg.
          </p>
          <ShareQrCode
            url={profileShare.profileShareUrl}
            label="QR kód a profil megosztási azonosítóhoz"
            downloadName="profil-megosztas-qr.png"
          />
          <div className="flex items-center gap-1.5">
            <input
              readOnly
              value={profileShare.profileShareUrl}
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 rounded-lg border border-input bg-muted px-2 py-1.5 text-xs font-mono"
            />
            <Button type="button" size="sm" onClick={copyLink} aria-label="Profil QR link másolása">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={profileShare.rotate} disabled={profileShare.busy}>
              <RefreshCw className="size-3.5" /> Rotálás
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={profileShare.disable} disabled={profileShare.busy}>
              <Ban className="size-3.5" /> Kikapcsolás
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Jelenleg ki van kapcsolva. Bekapcsoláskor új, nem kitalálható profil azonosítót generál a szerver.
          </p>
          <Button type="button" size="sm" onClick={profileShare.enable} disabled={profileShare.busy} className="w-full">
            Profil QR bekapcsolása
          </Button>
        </div>
      )}

      {profileShare.error && <InlineError message={profileShare.error} onRetry={profileShare.refresh} />}
    </section>
  )
}
