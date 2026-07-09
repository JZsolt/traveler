import { useState } from 'react'
import { API } from '@/lib/constants'
import { getApiErrorMessage, isImportBackupResult, isImportSingleBackupResponse } from '@/types/guards'
import type { ImportBackupMode, ImportBackupResult, ImportBackupState, ParsedBackupFile } from '@/types/components'
import type { ImportBackupProps, ImportBackupReturn } from '@/types/hooks'

export function useImportBackup({ refetch, fileRef }: ImportBackupProps): ImportBackupReturn {
  const [mode, setMode] = useState<ImportBackupMode>('create')
  const [state, setState] = useState<ImportBackupState>('idle')
  const [result, setResult] = useState<ImportBackupResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')

  async function handleImport() {
    const files = fileRef.current?.files
    if (!files || files.length === 0) return
    if (!password.trim()) return

    setState('loading')
    setResult(null)
    setError(null)

    try {
      const parsed: ParsedBackupFile[] = []
      for (const file of files) {
        const text = await file.text()
        try {
          parsed.push({ name: file.name, data: JSON.parse(text) })
        } catch {
          setState('error')
          setError(`Ervenytelen JSON fajl: ${file.name}`)
          return
        }
      }

      if (parsed.length === 1) {
        const res = await fetch(API.IMPORT_TRIP, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, backup: parsed[0].data, password }),
        })
        const data: unknown = await res.json()

        if (!isImportSingleBackupResponse(data)) {
          setState('error')
          setError('Hibás válasz a szervertől.')
          return
        }

        if (!res.ok || !data.ok || !data.slug) {
          setState('error')
          setError(data.error?.message || 'Ismeretlen hiba tortent.')
          return
        }

        setState('success')
        setResult({
          importedCount: 1,
          failedCount: 0,
          results: [{ slug: data.slug, created: data.created, updated: data.updated }],
          errors: [],
        })
      } else {
        const res = await fetch(API.IMPORT_TRIPS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, backups: parsed.map(p => p.data), password }),
        })
        const data: unknown = await res.json()

        if (!res.ok) {
          setState('error')
          setError(getApiErrorMessage(data, 'Ismeretlen hiba tortent.'))
          return
        }

        if (!isImportBackupResult(data)) {
          setState('error')
          setError('Hibás válasz a szervertől.')
          return
        }

        if (data.failedCount > 0) {
          setState('partial')
          setResult({ ...data, fileNames: parsed.map(p => p.name) })
        } else {
          setState('success')
          setResult(data)
        }
      }

      refetch()
      setPassword('')
      if (fileRef.current) fileRef.current.value = ''
    } catch {
      setState('error')
      setError('Nincs internetkapcsolat vagy a szerver nem elerheto.')
    }
  }

  return { mode, setMode, state, result, error, password, setPassword, handleImport }
}
