import { useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { LogOut, User } from 'lucide-react'

const TAP_THRESHOLD = 5
const TAP_WINDOW_MS = 3000

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    }
  }, [])

  const handleVersionTap = useCallback(() => {
    tapCountRef.current += 1
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    if (tapCountRef.current >= TAP_THRESHOLD) {
      tapCountRef.current = 0
      navigate(ROUTES.ADMIN_BACKUP)
      return
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0
    }, TAP_WINDOW_MS)
  }, [navigate])

  async function handleSignOut() {
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  return (
    <main className="pb-16 px-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px) + 1.5rem)' }}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Beallitasok</h1>

        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                {profile?.display_name && (
                  <p className="text-sm font-medium text-slate-800 truncate">{profile.display_name}</p>
                )}
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Kijelentkezes
          </Button>
        </div>

        <div className="mt-16 text-center">
          <p
            className="text-xs text-muted-foreground/50 select-none cursor-default"
            onClick={handleVersionTap}
          >
            Az Utazasaim v1.0
          </p>
        </div>
      </div>
    </main>
  )
}
