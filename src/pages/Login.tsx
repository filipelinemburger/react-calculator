import React, { useEffect, useState } from "react"
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/authContext"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuthContext()
  const navigate = useNavigate()

  const baseUrl = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    setTimeout(() => setError(""), 5000)
  }, [error])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response: any = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      })

      await login(response.data.token)
      navigate("/home")
    } catch (error: any) {
      setError(error.response.data)
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
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              disabled={!username || !password || isLoading === true}
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
            type="submit"
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
