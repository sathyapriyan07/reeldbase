import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import { authApi } from '@/lib/api'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        authApi.getProfile(session.user.id).then(setProfile).catch(() => setProfile(null))
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        authApi.getProfile(session.user.id).then(setProfile).catch(() => setProfile(null))
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    await authApi.signIn(email, password)
  }

  const signUp = async (email: string, password: string, username: string) => {
    await authApi.signUp(email, password, username)
  }

  const signOut = async () => {
    await authApi.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    try {
      const session = await authApi.getSession()
      if (session?.user) {
        const p = await authApi.getProfile(session.user.id)
        setProfile(p)
      }
    } catch {
      setProfile(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin: profile?.role === 'admin' || user?.user_metadata?.role === 'admin',
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
