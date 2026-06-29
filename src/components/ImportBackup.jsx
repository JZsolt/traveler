import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTrips } from '@/context/TripsContext'

export function ImportBackup() {
  const [mode, setMode] = useState('create')
  const [state, setState] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)
  const { refetch } = useTrips()

  async function handleImport() {
    const files = fileRef.current?.files
    if (!files || files.length === 0) return

    setState('loading')
    setResult(null)
    setError(null)

    try {
      const parsed = []
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

      let res, data

      if (parsed.length === 1) {
        res = await fetch('/api/import-trip-backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, backup: parsed[0].data }),
        })
        data = await res.json()

        if (!res.ok || !data.ok) {
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
        res = await fetch('/api/import-trip-backups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, backups: parsed.map(p => p.data) }),
        })
        data = await res.json()

        if (data.error) {
          setState('error')
          setError(data.error?.message || 'Ismeretlen hiba tortent.')
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
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      console.error('[ImportBackup]', err)
      setState('error')
      setError('Nincs internetkapcsolat vagy a szerver nem elerheto.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">Import</h3>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              mode === 'create'
                ? 'bg-[#0f3460] text-white border-[#0f3460]'
                : 'bg-white text-[#0f3460] border-gray-300'
            }`}
          >
            Ujkent importalas
          </button>
          <button
            type="button"
            onClick={() => setMode('upsert-by-slug')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              mode === 'upsert-by-slug'
                ? 'bg-[#0f3460] text-white border-[#0f3460]'
                : 'bg-white text-[#0f3460] border-gray-300'
            }`}
          >
            Frissites slug alapjan
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".json"
          multiple
          className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0f3460] file:text-white hover:file:bg-[#1a1a2e] file:cursor-pointer"
        />

        <Button
          onClick={handleImport}
          disabled={state === 'loading'}
          className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-sm px-4 py-2"
        >
          {state === 'loading' ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Importalas...
            </span>
          ) : (
            'Importalas'
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
            {state === 'success' ? 'Sikeres import!' : 'Reszleges import'}
          </p>
          <p>Importalva: {result.importedCount} db</p>
          {result.results?.map((r, i) => (
            <p key={i}>
              <code className="bg-white/50 px-1 rounded">{r.slug}</code>
              {' '}{r.created ? '(letrehozva)' : '(frissitve)'}
            </p>
          ))}
          {result.errors?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <p className="font-semibold">Sikertelen ({result.failedCount} db):</p>
              {result.errors.map((e, i) => (
                <p key={i}>
                  <code className="bg-white/50 px-1 rounded">
                    {result.fileNames?.[e.index] || e.slug}
                  </code>
                  {' '} — {e.error}
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
