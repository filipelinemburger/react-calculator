import axios from "axios"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import IRecord from "../types/record.type"

interface IUserContext {
  isLoading: boolean
  operations: IRecord[] | undefined
  currentBalance: number | undefined
  totalOperations: number | undefined
  setIsLoading: (isLoading: boolean) => void
  refreshUserStats: () => void
  getOperations: () => void
}

const UserContext = createContext<IUserContext | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL
  const [operations, setOperations] = useState<IRecord[] | undefined>()
  const [currentBalance, setCurrentBalance] = useState<number | undefined>()
  const [totalOperations, setTotalOperations] = useState<number | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const refreshUserStats = useCallback(async () => {
    try {
      setIsLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
      }
      const response: any = await axios.get(`${baseUrl}/operation/user-stats`, {
        headers: headers,
      })
      if (response.data) {
        await setCurrentBalance(response.data.currentBalance)
        setTotalOperations(response.data.totalOperations)
      }
    } catch (error: any) {
      console.error("Failed to get current balance", error)
    } finally {
      setIsLoading(false)
    }
  }, [baseUrl])

  const getOperations = useCallback(async () => {
    try {
      setIsLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
      }
      const response: any = await axios.get(`${baseUrl}/operation/`, {
        headers: headers,
      })
      setOperations(response.data)
    } catch (error: any) {
      console.error("Failed to get current balance", error)
    } finally {
      setIsLoading(false)
    }
  }, [baseUrl])

  useEffect(() => {
    if (!currentBalance) {
      refreshUserStats()
    }
  }, [currentBalance, refreshUserStats])

  const contextValues = useMemo(() => {
    return {
      isLoading,
      operations,
      currentBalance,
      totalOperations,
      setIsLoading,
      getOperations,
      refreshUserStats,
    }
  }, [
    isLoading,
    operations,
    currentBalance,
    totalOperations,
    setIsLoading,
    getOperations,
    refreshUserStats,
  ])

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(
      "useUserContext must be used within an UserProvider. Wrap a parent component in <UserProvider> to fix this error."
    )
  }
  return context
}
