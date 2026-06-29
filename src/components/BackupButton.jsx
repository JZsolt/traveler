import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function BackupButton() {
  const [state, setState] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleBackup() {
    setState('loading')
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/backup-trips', { method: 'POST' })
      const data = await res.json()

      if (data.error) {
        setState('error')
        setError(data.error?.message || 'Ismeretlen hiba tortent.')
        return
      }

      if (data.failedFiles?.length > 0) {
        setState('partial')
        setResult(data)
        return
      }

      setState('success')
      setResult(data)
    } catch (err) {
      console.error('[BackupButton]', err)
      setState('error')
      setError('Nincs internetkapcsolat vagy a szerver nem elerheto.')
    }
  }

  const lastCommit = result?.commits?.at(-1)

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">Biztonsagi mentes</h3>

      <Button
        onClick={handleBackup}
        disabled={state === 'loading'}
        className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-sm px-4 py-2"
      >
        {state === 'loading' ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Export folyamatban...
          </span>
        ) : (
          'Export mentes Gitre'
        )}
      </Button>

      {(state === 'success' || state === 'partial') && result && (
        <div className={`mt-3 rounded-xl p-3 text-xs space-y-1 border ${
          state === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <p className="font-semibold">
            {state === 'success' ? 'Sikeres mentes!' : 'Reszleges mentes'}
          </p>
          <p>Idopont: {new Date(result.exportedAt).toLocaleString('hu-HU')}</p>
          <p>Utazasok: {result.tripCount} db</p>
          <p>Mentett fajlok: {result.fileCount} db</p>
          <p>Manifest: <code className="bg-white/50 px-1 rounded">{result.manifestPath}</code></p>
          {lastCommit?.commitSha && (
            <p>
              Utolso commit: <code className="bg-white/50 px-1 rounded">{lastCommit.commitSha.slice(0, 7)}</code>
              {lastCommit.commitUrl && (
                <>
                  {' '}
                  <a
                    href={lastCommit.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Megnyitas
                  </a>
                </>
              )}
            </p>
          )}
          {result.failedFiles?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <p className="font-semibold">Sikertelen fajlok:</p>
              {result.failedFiles.map((f, i) => (
                <p key={i}>
                  <code className="bg-white/50 px-1 rounded">{f.path}</code> — {f.error}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {state === 'error' && error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
          <p className="font-semibold">Hiba tortent</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
