// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom"
import { useAuthContext } from "../context/authContext"

const PrivateRoute = ({ children }: any) => {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated ? children : <Navigate to="/" />
}

export default PrivateRoute
