import React, { createContext, useCallback, useContext, useMemo } from "react"

interface IAuthContext {
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<IAuthContext | undefined>(undefined) // Define context type

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const JWT_TOKEN = "jwt_token"
  const login = useCallback((token: string) => {
    sessionStorage.setItem(JWT_TOKEN, token)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(JWT_TOKEN)
  }, [])

  const isAuthenticated = useMemo(() => {
    console.log(
      "sessionStorage.getItem(JWT_TOKEN)",
      sessionStorage.getItem(JWT_TOKEN)
    )
    return sessionStorage.getItem(JWT_TOKEN) !== null
  }, [])

  const contextValues = useMemo(() => {
    return {
      login,
      logout,
      isAuthenticated,
    }
  }, [login, logout, isAuthenticated])

  return (
    <AuthContext.Provider value={contextValues}>
      {children} {/* Render children properly */}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthProvider. Wrap a parent component in <AuthProvider> to fix this error."
    )
  }
  return context
}
