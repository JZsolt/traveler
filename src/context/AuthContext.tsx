import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthContext } from './authContextValue'
import { supabase } from '@/lib/supabase'
import { toAppUser, mapAuthError } from '@/lib/authErrors'
import { ProfileSchema } from '@/schemas/auth'
import type { AuthUser } from '@supabase/supabase-js'
import type { AppUser, Profile, AuthResult, AuthProviderProps } from '@/types/auth'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!!supabase)
  const mountedRef = useRef(true)

  const clearAuthState = useCallback(() => {
    setUser(null)
    setProfile(null)
    setProfileError(null)
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!mountedRef.current) return
    if (error) {
      setProfileError('A profil betoltese sikertelen.')
      setProfile(null)
      return
    }
    const parsed = ProfileSchema.safeParse(data)
    if (parsed.success) {
      setProfile(parsed.data)
      setProfileError(null)
    } else {
      setProfile(null)
      setProfileError('A profil adatok ervenytelenek.')
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  const applySession = useCallback(async (authUser: AuthUser) => {
    const appUser = toAppUser(authUser)
    if (appUser) {
      setUser(appUser)
      await fetchProfile(appUser.id)
    } else {
      clearAuthState()
    }
  }, [fetchProfile, clearAuthState])

  useEffect(() => {
    if (!supabase) return
    mountedRef.current = true

    const client = supabase

    const initSession = async () => {
      const { data: { session } } = await client.auth.getSession()
      if (!mountedRef.current) return
      if (session?.user) {
        await applySession(session.user)
      }
      setIsLoading(false)
    }

    void initSession()

    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mountedRef.current) return
        if (session?.user) {
          await applySession(session.user)
        } else {
          clearAuthState()
        }
      },
    )

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [applySession, clearAuthState])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase nincs konfigurálva.' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: mapAuthError(error) }
    return { ok: true }
  }, [])

  const signUp = useCallback(async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase nincs konfigurálva.' }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) return { ok: false, error: mapAuthError(error) }
    return { ok: true }
  }, [])

  // Trip cache clearing on signOut is handled in 15-10 (TripsContext user scoping)
  const signOutFn = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    clearAuthState()
  }, [clearAuthState])

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase nincs konfigurálva.' }
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) return { ok: false, error: mapAuthError(error) }
    return { ok: true }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      profileError,
      isLoading,
      signIn,
      signUp,
      signOut: signOutFn,
      resetPassword,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
