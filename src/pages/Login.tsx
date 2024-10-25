import React, { useEffect, useState } from "react"
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/authContext"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, isAuthenticated } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    // Clear the error message after 5 seconds
    if (error) {
      const timeout = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timeout)
    }
  }, [error])

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/home")
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await login(username, password)
      const params = { username: username }
      navigate("/home", { state: params })
    } catch (error: any) {
      setError(error.response.data || "Login failed")
      console.error("Login failed", error)
      setUsername("")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mt-5">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin} className="mt-5">
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Form.Group>

            <Button
              disabled={!username || !password || isLoading}
              variant="primary"
              type="submit"
              className="w-100 mt-3"
            >
              Login
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-4">
        <Col xs={12} md={6} className="justify-content-md-center">
          <p className="d-flex justify-content-md-center">New to app?</p>
          <Button
            variant="light"
            type="button"
            className="w-100"
            onClick={() => navigate("/register")}
          >
            Create account
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
