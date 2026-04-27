import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const TOKEN_KEY = 'dl-auth-token'
const API_BASE = '/api'

export interface AuthUser {
  id: string
  email: string
  username: string
  avatar_url?: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  authFetch: (url: string, options?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

async function migrateLocalStorageOnAuth(token: string) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // Migrate solved problems
  const solvedRaw = localStorage.getItem('dl-solved-problems')
  if (solvedRaw) {
    try {
      const ids: string[] = JSON.parse(solvedRaw)
      await Promise.allSettled(
        ids.map(id => fetch(`${API_BASE}/users/me/solved/${id}`, { method: 'POST', headers }))
      )
    } catch {}
    localStorage.removeItem('dl-solved-problems')
  }

  // Migrate custom problem lists
  const listsRaw = localStorage.getItem('dl-problem-lists')
  if (listsRaw) {
    try {
      const lists: Array<{ name: string; problemIds: string[] }> = JSON.parse(listsRaw)
      for (const lst of lists) {
        const res = await fetch(`${API_BASE}/users/me/lists`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: lst.name }),
        })
        if (res.ok) {
          const created = await res.json()
          await Promise.allSettled(
            (lst.problemIds ?? []).map(pid =>
              fetch(`${API_BASE}/users/me/lists/${created.id}/items`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ problem_id: pid }),
              })
            )
          )
        }
      }
    } catch {}
    localStorage.removeItem('dl-problem-lists')
  }

  // Drop pre-auth submissions (no user_id to associate)
  localStorage.removeItem('dl-problem-submissions')
  // Roadmap progress is derived from solved problems server-side
  localStorage.removeItem('dl-roadmap-completed')
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(true)
  const refreshingRef = useRef(false)

  const saveSession = useCallback((accessToken: string, userData: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    setToken(accessToken)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const tryRefresh = useCallback(async (): Promise<string | null> => {
    if (refreshingRef.current) return null
    refreshingRef.current = true
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        clearSession()
        return null
      }
      const data = await res.json()
      saveSession(data.access_token, data.user)
      return data.access_token
    } catch {
      clearSession()
      return null
    } finally {
      refreshingRef.current = false
    }
  }, [clearSession, saveSession])

  // Rehydrate session on mount
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (!stored) {
        // Try refresh cookie anyway (user may have cleared localStorage)
        await tryRefresh()
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        })
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
          setToken(stored)
        } else {
          // Access token expired — try refresh
          await tryRefresh()
        }
      } catch {
        clearSession()
      }
      setIsLoading(false)
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const currentToken = localStorage.getItem(TOKEN_KEY)
      const headers = new Headers(options.headers)
      if (currentToken) headers.set('Authorization', `Bearer ${currentToken}`)
      headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json')

      let res = await fetch(url, { ...options, headers, credentials: 'include' })

      if (res.status === 401) {
        const newToken = await tryRefresh()
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`)
          res = await fetch(url, { ...options, headers, credentials: 'include' })
        }
      }
      return res
    },
    [tryRefresh]
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Login failed' }))
        throw new Error(err.detail ?? 'Login failed')
      }
      const data = await res.json()
      saveSession(data.access_token, data.user)
    },
    [saveSession]
  )

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Registration failed' }))
        throw new Error(err.detail ?? 'Registration failed')
      }
      const data = await res.json()
      saveSession(data.access_token, data.user)
      await migrateLocalStorageOnAuth(data.access_token)
    },
    [saveSession]
  )

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' })
    } catch {}
    clearSession()
  }, [clearSession])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}
