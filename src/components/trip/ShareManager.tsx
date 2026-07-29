import { useEffect, useRef, useState } from 'react'
import { Copy, Check, X, Link2, Ban, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { useTripSharing } from '@/hooks/useTripSharing'
import type { ShareManagerProps } from '@/types/shared'

export function ShareManager({ slug, onClose }: ShareManagerProps) {
  const { loading, busy, error, isActive, shareUrl, createLink, disable, regenerate } = useTripSharing({ slug })
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dialogRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-manager-title"
        tabIndex={-1}
        className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl outline-none"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <p id="share-manager-title" className="text-lg font-bold text-[#1a1a2e] flex items-center gap-2">
            <Link2 className="w-5 h-5" /> Megosztás
          </p>
          <button onClick={onClose} aria-label="Bezárás" className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 py-4">Betöltés...</p>
        ) : (
          <div className="space-y-4">
            {shareUrl ? (
              <>
                <p className="text-sm text-gray-600">
                  Bárki, akinek elküldöd ezt a linket, megtekintheti az útitervet — szerkesztés nélkül.
                </p>
                <div className="flex items-center gap-1.5">
                  <input
                    readOnly
                    value={shareUrl}
                    onFocus={e => e.target.select()}
                    className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono bg-gray-50"
                  />
                  <Button size="sm" onClick={() => handleCopy(shareUrl)} className="shrink-0" aria-label="Link másolása">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={regenerate} disabled={busy}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Új link
                  </Button>
                  <Button variant="outline" size="sm" onClick={disable} disabled={busy} className="text-red-600 border-red-200 hover:bg-red-50">
                    <Ban className="w-3.5 h-3.5 mr-1" /> Kikapcsolás
                  </Button>
                </div>
              </>
            ) : isActive ? (
              <>
                <p className="text-sm text-gray-600">
                  A megosztás <strong>aktív</strong>. Biztonsági okból a meglévő linket nem tudjuk újra megmutatni — ha újra szükséged van rá, generálj újat (a régi érvénytelenné válik).
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={regenerate} disabled={busy}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Új link generálása
                  </Button>
                  <Button variant="outline" size="sm" onClick={disable} disabled={busy} className="text-red-600 border-red-200 hover:bg-red-50">
                    <Ban className="w-3.5 h-3.5 mr-1" /> Kikapcsolás
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Hozz létre egy megosztási linket, amellyel bárki megtekintheti ezt az útitervet — csak olvasható módban.
                </p>
                <Button size="sm" onClick={createLink} disabled={busy} className="w-full">
                  {busy ? 'Létrehozás...' : 'Megosztási link létrehozása'}
                </Button>
              </>
            )}
          </div>
        )}

        {error && <div className="mt-3"><InlineError message={error} /></div>}
      </div>
    </div>
  )
}
