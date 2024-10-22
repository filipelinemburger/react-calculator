import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap"
import { useAuthContext } from "../context/authContext"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    setTimeout(() => setError(""), 10000)
  }, [error])

  const handleSubmit = async (e: any) => {
    try {
      setIsLoading(true)
      e.preventDefault()
      const response = await axios.post(`${baseUrl}/api/auth/register`, {
        username,
        password,
      })
      login(response.data.token)
      navigate("/")
    } catch (error: any) {
      console.error("Register failed", error)
      if (error.response.data) {
        setError(error.response.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mt-5">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
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
              variant="primary"
              type="submit"
              className="w-100"
              disabled={!username || !password || isLoading === true}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Register"
              )}
            </Button>
            <div className="mt-5">
              <Button
                variant="light"
                onClick={() => navigate("/")}
                className="w-100"
              >
                Back to Login
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Register
