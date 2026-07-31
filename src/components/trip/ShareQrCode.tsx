import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import type { ShareQrCodeProps } from '@/types/shared'

// A QR a PUBLIC URL-bol keszul (nem token hash/ciphertext-bol). Letoltes: a
// rendereltcanvas -> PNG data URL -> <a download>. A tokent sehol nem taroljuk.
export function ShareQrCode({
  url,
  label = 'QR kód a megosztási linkhez',
  downloadName = 'megosztas-qr.png',
}: ShareQrCodeProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  function download() {
    setDownloadError(null)
    try {
      const canvas = wrapRef.current?.querySelector('canvas')
      if (!canvas) throw new Error('QR canvas nem talalhato')
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = downloadName
      link.click()
    } catch (err) {
      if (import.meta.env.DEV) console.error('[ShareQrCode] QR letoltes sikertelen', err)
      setDownloadError('A QR letöltése nem sikerült. Próbáld inkább a link másolását.')
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={wrapRef}
        role="img"
        aria-label={label}
        className="bg-white p-2 rounded-lg border border-gray-100"
      >
        <QRCodeCanvas value={url} size={160} level="M" />
      </div>
      <Button variant="outline" size="sm" onClick={download}>
        <Download className="w-3.5 h-3.5 mr-1" /> QR letöltése
      </Button>
      {downloadError && <InlineError message={downloadError} />}
    </div>
  )
}
