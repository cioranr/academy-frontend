'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { BackendUser } from '@/types'
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout, setToken, removeToken, getToken } from './api'

interface AuthContextType {
  user: BackendUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: Parameters<typeof apiRegister>[0]) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  isEventsManager: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (getToken()) {
      getMe().then(setUser).catch(() => { removeToken(); setUser(null) }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await apiLogin(email, password)
    setToken(token); setUser(user)
  }, [])

  const register = useCallback(async (data: Parameters<typeof apiRegister>[0]) => {
    const { user, token } = await apiRegister(data)
    setToken(token); setUser(user)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout(); setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'
  const isEventsManager = user?.role === 'admin' || user?.role === 'events_manager'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isEventsManager }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
