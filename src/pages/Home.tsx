// src/pages/HomePage.js
import { Button, Container, Row, Col, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../context/userContext"
import { useEffect } from "react"
import { useAuthContext } from "../context/authContext"

const HomePage = () => {
  const navigate = useNavigate()
  const { isLoading, currentBalance, totalOperations } = useUserContext()
  const { isAuthenticated } = useAuthContext()
  const { refreshUserStats } = useUserContext()

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserStats()
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ margin: "25% 0% 0% 0%" }}
      >
        <Spinner animation="border" role="status" />
      </Container>
    )
  }

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <h1 className="text-center mt-5">Welcome to Calculator App</h1>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <p className="text-center mt-5">
              Your current balance is {currentBalance}. You have already done{" "}
              {totalOperations} operations
            </p>
          </Col>
        </Row>

        <Row className="justify-content-md-center mt-5">
          <Col xs={12} md={6} className="justify-content-md-center">
            <Button
              className="w-100"
              variant="primary"
              onClick={() => navigate("/operation")}
            >
              New Operation
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default HomePage
