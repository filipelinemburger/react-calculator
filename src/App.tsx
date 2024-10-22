import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"
import Layout from "./components/Layout/Layout"
import "bootstrap/dist/css/bootstrap.min.css"
import Operation from "./pages/Operation"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import { AuthProvider } from "./context/authContext"
import { UserProvider } from "./context/userContext"
import OperationList from "./pages/OperationList"

function App() {
  return (
    <Router basename="/react-calculator">
      <AuthProvider>
        <UserProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/operation"
                element={
                  <PrivateRoute>
                    <Operation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <OperationList />
                  </PrivateRoute>
                }
              />
              {/* <Route
              path="/about"
              element={
                <PrivateRoute>
                <About />
                </PrivateRoute>
                }
                /> */}
            </Routes>
          </Layout>
        </UserProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
