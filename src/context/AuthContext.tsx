import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthContext } from './authContextValue'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'
import { toAppUser, mapAuthError, mapProfileError } from '@/lib/authErrors'
import { ProfileSchema } from '@/schemas/auth'
import type { AuthUser } from '@supabase/supabase-js'
import type { AppUser, Profile, AuthResult, AuthProviderProps } from '@/types/auth'

async function createMissingProfile(userId: string, displayName: string | null): Promise<Profile> {
  if (!supabase) throw new Error('Supabase nincs konfigurálva.')

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, display_name: displayName })
    .select('*')
    .maybeSingle()

  if (!error) {
    const parsed = ProfileSchema.safeParse(data)
    if (parsed.success) return parsed.data
    throw new Error('A letrehozott profil adatok ervenytelenek.')
  }

  const { data: existing, error: readError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  const parsed = ProfileSchema.safeParse(existing)
  if (parsed.success) return parsed.data

  // A nyers PostgREST hiba objektumot dobjuk tovabb (code-ot hordoz) — a
  // mapProfileError kategorizal, nyers angol uzenet nem jut user-facing state-be.
  throw readError ?? error
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!!supabase)
  const mountedRef = useRef(true)
  const inFlightProfileRef = useRef<{ userId: string; promise: Promise<void> } | null>(null)

  const clearAuthState = useCallback(() => {
    inFlightProfileRef.current = null
    setUser(null)
    setProfile(null)
    setProfileError(null)
  }, [])

  // Idempotens: ha ugyanarra a userId-ra mar fut egy fetch (pl. az
  // onAuthStateChange INITIAL_SESSION es a getSession fallback egyszerre indit),
  // a mar futo promise-t adjuk vissza — nincs duplikalt profil request.
  const fetchProfile = useCallback((authUser: AuthUser): Promise<void> => {
    if (!supabase) return Promise.resolve()
    const inFlight = inFlightProfileRef.current
    if (inFlight && inFlight.userId === authUser.id) return inFlight.promise

    const client = supabase
    const displayName = typeof authUser.user_metadata.display_name === 'string'
      ? authUser.user_metadata.display_name
      : null

    const promise = (async () => {
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle()
        if (!mountedRef.current) return
        if (error) throw error

        const profileData: unknown = data ?? await createMissingProfile(authUser.id, displayName)
        if (!mountedRef.current) return

        const parsed = ProfileSchema.safeParse(profileData)
        if (!parsed.success) {
          throw new Error('A profil adatok ervenytelenek.')
        }

        setProfile(parsed.data)
        setProfileError(null)
      } catch (err) {
        if (!mountedRef.current) return
        if (import.meta.env.DEV) console.error('Profil betoltesi hiba:', err)
        setProfile(null)
        setProfileError(mapProfileError(err))
      } finally {
        inFlightProfileRef.current = null
      }
    })()

    inFlightProfileRef.current = { userId: authUser.id, promise }
    return promise
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) return
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) await fetchProfile(authUser)
  }, [user, fetchProfile])

  const applySession = useCallback(async (authUser: AuthUser) => {
    const appUser = toAppUser(authUser)
    if (appUser) {
      setUser(appUser)
      await fetchProfile(authUser)
    } else {
      clearAuthState()
    }
    setIsLoading(false)
  }, [fetchProfile, clearAuthState])

  useEffect(() => {
    if (!supabase) return
    mountedRef.current = true

    const client = supabase

    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mountedRef.current) return
        if (session?.user) {
          await applySession(session.user)
        } else {
          clearAuthState()
          setIsLoading(false)
        }
      },
    )

    // Fallback: nem minden runtime kuld initial session eventet az
    // onAuthStateChange-en keresztul. A getSession garantalja, hogy az
    // isLoading feloldodjon; a fetchProfile in-flight dedup miatt ez nem
    // okoz duplikalt profil requestet az INITIAL_SESSION event mellett.
    client.auth.getSession()
      .then(({ data: { session } }) => {
        if (!mountedRef.current) return
        if (session?.user) {
          void applySession(session.user)
        } else {
          clearAuthState()
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (mountedRef.current) setIsLoading(false)
      })

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

  const signOutFn = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    queryClient.clear()
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
