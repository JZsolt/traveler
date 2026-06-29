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

      if (!res.ok || !data.ok) {
        setState('error')
        setError(data.error?.message || 'Ismeretlen hiba tortent.')
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

      {state === 'success' && result && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 space-y-1">
          <p className="font-semibold">Sikeres mentes!</p>
          <p>Idopont: {new Date(result.exportedAt).toLocaleString('hu-HU')}</p>
          <p>Utazasok: {result.tripCount} db</p>
          <p>Fajl: <code className="bg-green-100 px-1 rounded">{result.path}</code></p>
          {result.commitSha && (
            <p>
              Commit: <code className="bg-green-100 px-1 rounded">{result.commitSha.slice(0, 7)}</code>
              {result.commitUrl && (
                <>
                  {' '}
                  <a
                    href={result.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 underline"
                  >
                    Megnyitas
                  </a>
                </>
              )}
            </p>
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
