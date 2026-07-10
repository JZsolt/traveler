import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { API } from '@/lib/constants'
import { getApiErrorMessage, isBackupResult } from '@/types/guards'
import type { BackupResult, BackupState } from '@/types/components'

export function BackupButton() {
  const [state, setState] = useState<BackupState>('idle')
  const [result, setResult] = useState<BackupResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')

  async function handleBackup() {
    if (!password.trim()) return
    setState('loading')
    setResult(null)
    setError(null)

    try {
      const res = await fetch(API.BACKUP_TRIPS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data: unknown = await res.json()

      if (!res.ok) {
        setState('error')
        setError(getApiErrorMessage(data, 'Ismeretlen hiba tortent.'))
        return
      }

      if (!isBackupResult(data)) {
        setState('error')
        setError('Hibás válasz a szervertől.')
        return
      }

      setPassword('')
      const hasFailures = (data.failedFiles?.length ?? 0) > 0
      const hasSkipped = (data.skippedCount ?? 0) > 0
      if (hasFailures || hasSkipped) {
        setState('partial')
        setResult(data)
        return
      }

      setState('success')
      setResult(data)
    } catch {
      setState('error')
      setError('Nincs internetkapcsolat vagy a szerver nem elerheto.')
    }
  }

  const lastCommit = result?.commits?.[result.commits.length - 1]

  return (
    <div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs text-slate-500 mb-1">Admin jelszó a mentéshez</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Admin jelszó"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460]"
          />
        </div>
        <Button
          onClick={handleBackup}
          disabled={state === 'loading' || !password.trim()}
          className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-sm px-4 py-2 shrink-0"
        >
          {state === 'loading' ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Export...
            </span>
          ) : (
            'Export mentés Gitre'
          )}
        </Button>
      </div>

      {(state === 'success' || state === 'partial') && result && (
        <div className={`mt-3 rounded-xl p-3 text-xs space-y-1 border ${
          state === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <p className="font-semibold">
            {state === 'success' ? 'Sikeres mentés!' : 'Részleges mentés'}
          </p>
          <p>Időpont: {new Date(result.exportedAt).toLocaleString('hu-HU')}</p>
          <p>Utazások: {result.tripCount} db</p>
          <p>Mentett fájlok: {result.fileCount} db</p>
          <p>Manifest: <code className="bg-white/50 px-1 rounded">{result.manifestPath}</code></p>
          {lastCommit?.commitSha && (
            <p>
              Utolsó commit: <code className="bg-white/50 px-1 rounded">{lastCommit.commitSha.slice(0, 7)}</code>
              {lastCommit.commitUrl && (
                <>
                  {' '}
                  <a
                    href={lastCommit.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Megnyitás
                  </a>
                </>
              )}
            </p>
          )}
          {(result.skippedCount ?? 0) > 0 && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <p className="font-semibold">Kihagyott utazasok ({result.skippedCount} db — ervenytelen adat):</p>
              {result.skippedSlugs?.map((slug, i) => (
                <p key={i}><code className="bg-white/50 px-1 rounded">{slug}</code></p>
              ))}
            </div>
          )}
          {(result.failedFiles?.length ?? 0) > 0 && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <p className="font-semibold">Sikertelen fajlok:</p>
              {result.failedFiles?.map((f, i) => (
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
          <p className="font-semibold">Hiba történt</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
