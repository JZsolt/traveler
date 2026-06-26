export function DbError({ error }) {
  return (
    <div className="max-w-lg mx-auto mt-20 px-6">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
        <p className="text-3xl">🔴</p>
        <h2 className="text-lg font-bold text-red-800">Adatbázis hiba</h2>
        <p className="text-sm text-red-700">{error.message}</p>
        <div className="text-left bg-red-100 rounded-lg p-4 text-xs text-red-800 space-y-2">
          <p className="font-semibold">Debug checklist:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Van <code className="bg-red-200 px-1 rounded">.env.local</code> fajl a projekt gyokereben?</li>
            <li><code className="bg-red-200 px-1 rounded">VITE_SUPABASE_URL</code> es <code className="bg-red-200 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> ki van toltve?</li>
            <li>A Supabase projekt el es a <code className="bg-red-200 px-1 rounded">trips</code> tabla letezik?</li>
            <li>RLS GRANT-ok futtatva? (<code className="bg-red-200 px-1 rounded">GRANT SELECT ON public.trips TO anon</code>)</li>
            <li>Seed lefutott? (<code className="bg-red-200 px-1 rounded">pnpm run seed</code>)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
