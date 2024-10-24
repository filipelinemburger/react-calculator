import axios from "axios"
import React, { createContext, useCallback, useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom"

interface IAuthContext {
  login: (username: string, password: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<IAuthContext | undefined>(undefined) // Define context type
export const JWT_TOKEN = "jwt_token"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_BASE_URL
  const login = useCallback(async (username: string, password: string) => {
    const response: any = await axios.post(`${baseUrl}/api/auth/login`, {
      username,
      password,
    })
    sessionStorage.setItem(JWT_TOKEN, response.data.jwt)
  }, [])

  const logout = useCallback(async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
      }
      await axios.post(`${baseUrl}/api/auth/logout`, null, { headers: headers })
      navigate("/")
    } catch (error: any) {
      console.error("Logout request failed", error)
    }
    sessionStorage.removeItem(JWT_TOKEN)
  }, [baseUrl, login, navigate])

  const isAuthenticated = useMemo(() => {
    return sessionStorage.getItem(JWT_TOKEN) !== null
  }, [login, logout])

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
