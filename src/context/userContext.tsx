import axios from "axios"
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import IRecord from "../types/record.type"
import { JWT_TOKEN } from "./authContext"

interface IUserContext {
  isLoading: boolean
  totalPages: number
  operations: IRecord[] | undefined
  currentBalance: number | undefined
  totalOperations: number | undefined
  setIsLoading: (isLoading: boolean) => void
  refreshUserStats: () => void
  clearContextData: () => void
  getOperations: (page: number, size: number) => void
}

const UserContext = createContext<IUserContext | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL
  const [operations, setOperations] = useState<IRecord[] | undefined>()
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentBalance, setCurrentBalance] = useState<number | undefined>()
  const [totalOperations, setTotalOperations] = useState<number | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const refreshUserStats = useCallback(async () => {
    if (sessionStorage.getItem(JWT_TOKEN) !== undefined) {
      console.log()
      try {
        setIsLoading(true)
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem(JWT_TOKEN)}`,
        }
        const response: any = await axios.get(
          `${baseUrl}/operation/user-stats`,
          {
            headers: headers,
          }
        )
        if (response.data) {
          await setCurrentBalance(response.data.currentBalance)
          setTotalOperations(response.data.totalOperations)
        }
      } catch (error: any) {
        console.error("Failed to get current balance", error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [baseUrl, sessionStorage])

  const getOperations = useCallback(
    async (page: number, size: number) => {
      try {
        setIsLoading(true)
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem(JWT_TOKEN)}`,
        }
        const response: any = await axios.get(
          `${baseUrl}/operation?page=${page}&size=${size}`,
          {
            headers: headers,
          }
        )
        await setTotalPages(response.data.totalPages)
        await setOperations(response.data.content)
      } catch (error: any) {
        console.error("Failed to get current balance", error)
      } finally {
        setIsLoading(false)
      }
    },
    [baseUrl]
  )

  const clearContextData = useCallback(() => {
    setOperations(undefined)
    setTotalPages(0)
    setCurrentBalance(undefined)
    setTotalOperations(undefined)
  }, [])

  const contextValues = useMemo(() => {
    return {
      isLoading,
      totalPages,
      operations,
      currentBalance,
      totalOperations,
      setIsLoading,
      getOperations,
      clearContextData,
      refreshUserStats,
    }
  }, [
    isLoading,
    totalPages,
    operations,
    currentBalance,
    totalOperations,
    setIsLoading,
    getOperations,
    clearContextData,
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
