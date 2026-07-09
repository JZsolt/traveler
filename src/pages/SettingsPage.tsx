import { useAdmin } from '@/hooks/useAdmin'
import { useAdminUnlock } from '@/hooks/useAdminUnlock'
import { Button } from '@/components/ui/button'
import { BackupButton } from '@/components/BackupButton'
import { ImportBackup } from '@/components/ImportBackup'
import { Lock, Unlock, LogOut, Database } from 'lucide-react'

export function SettingsPage() {
  const { isAdminUnlocked, unlockAdmin, lockAdmin } = useAdmin()
  const unlock = useAdminUnlock({ unlockAdmin })

  return (
    <main className="pb-16 px-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px) + 1.5rem)' }}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Beállítások</h1>

        {isAdminUnlocked ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">Admin mód aktív</p>
                <p className="text-xs text-emerald-600 mt-0.5">Szerkesztési és admin műveletek engedélyezve.</p>
              </div>
              <Button onClick={lockAdmin} variant="outline" size="sm" className="shrink-0">
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Zárolás
              </Button>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Biztonsági mentés</h2>
              </div>
              <BackupButton />
              <div className="border-t border-slate-100 pt-4">
                <ImportBackup />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={unlock.handleUnlock} className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <Lock className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-600">Az admin funkciók zárolva vannak. Add meg a jelszót a feloldáshoz.</p>
            </div>

            <div>
              <input
                type="password"
                value={unlock.password}
                onChange={e => unlock.setPassword(e.target.value)}
                placeholder="Admin jelszó"
                autoFocus
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460]"
              />
            </div>

            {unlock.error && (
              <p className="text-sm text-red-600">{unlock.error}</p>
            )}

            <Button type="submit" disabled={unlock.loading || !unlock.password.trim()} className="w-full bg-[#0f3460] hover:bg-[#1a1a2e] text-white">
              {unlock.loading ? 'Ellenőrzés...' : 'Feloldás'}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}
