import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTrips } from '@/hooks/useTrips'
import { useImportBackup } from '@/hooks/useImportBackup'

export function ImportBackup() {
  const { refetch } = useTrips()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const imp = useImportBackup({ refetch, fileRef })

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">Import</h3>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => imp.setMode('create')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              imp.mode === 'create'
                ? 'bg-[#0f3460] text-white border-[#0f3460]'
                : 'bg-white text-[#0f3460] border-gray-300'
            }`}
          >
            Ujkent importalas
          </button>
          <button
            type="button"
            onClick={() => imp.setMode('upsert-by-slug')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              imp.mode === 'upsert-by-slug'
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

        <div>
          <label className="block text-xs text-slate-500 mb-1">Admin jelszó az importhoz</label>
          <input
            type="password"
            value={imp.password}
            onChange={e => imp.setPassword(e.target.value)}
            placeholder="Admin jelszó"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460]"
          />
        </div>

        <Button
          onClick={imp.handleImport}
          disabled={imp.state === 'loading' || !imp.password.trim()}
          className="bg-[#0f3460] hover:bg-[#1a1a2e] text-white text-sm px-4 py-2"
        >
          {imp.state === 'loading' ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Importalas...
            </span>
          ) : (
            'Importalas'
          )}
        </Button>
      </div>

      {(imp.state === 'success' || imp.state === 'partial') && imp.result && (
        <div className={`mt-3 rounded-xl p-3 text-xs space-y-1 border ${
          imp.state === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <p className="font-semibold">
            {imp.state === 'success' ? 'Sikeres import!' : 'Reszleges import'}
          </p>
          <p>Importalva: {imp.result.importedCount} db</p>
          {imp.result.results?.map((r, i) => (
            <p key={i}>
              <code className="bg-white/50 px-1 rounded">{r.slug}</code>
              {' '}{r.created ? '(letrehozva)' : '(frissitve)'}
            </p>
          ))}
          {imp.result.errors?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <p className="font-semibold">Sikertelen ({imp.result.failedCount} db):</p>
              {imp.result.errors.map((e, i) => (
                <p key={i}>
                  <code className="bg-white/50 px-1 rounded">
                    {e.index !== undefined ? imp.result?.fileNames?.[e.index] : e.slug}
                  </code>
                  {' '} — {e.error}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {imp.state === 'error' && imp.error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
          <p className="font-semibold">Hiba tortent</p>
          <p>{imp.error}</p>
        </div>
      )}
    </div>
  )
}
