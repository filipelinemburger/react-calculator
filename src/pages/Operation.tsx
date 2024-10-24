import React, { useState, useEffect } from "react"
import { JWT_TOKEN, useAuthContext } from "../context/authContext"
import axios from "axios"
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap"
import { useUserContext } from "../context/userContext"

interface OperationResponse {
  operationResult: string
  amount: number
}

const Operation = () => {
  const { refreshUserStats } = useUserContext()
  const [isLoading, setLoading] = useState(false)
  const [operation, setOperation] = useState("ADDITION")
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")
  const [operationResponse, setOperationResponse] = useState<
    OperationResponse | undefined
  >()
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState<string | null>()

  const baseUrl = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    if (operationResponse) {
      setShowResult(true)
    }
  }, [operationResponse])

  const handleOperationChange = (e: any) => {
    setOperation(e.target.value)
    setShowResult(false)
  }

  const handleSubmit = async (e: any) => {
    setLoading(true)
    e.preventDefault()
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(JWT_TOKEN)}`,
      }

      const payload = {
        operationType: operation,
        ...(operation !== "RANDOM_STRING" && { value1, value2 }),
      }
      const response = await axios.post(
        `${baseUrl}/operation/calculate`,
        payload,
        { headers: headers }
      )
      setOperationResponse(response.data)
      await refreshUserStats()
    } catch (err: any) {
      console.error("Operation failed", err)
      if (err.response.data) {
        setError(err.response.data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Operation Calculator</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formOperationType">
              <Form.Label>Operation Type</Form.Label>
              <Form.Control
                as="select"
                value={operation}
                onChange={handleOperationChange}
              >
                <option value="ADDITION">Addition</option>
                <option value="SUBTRACTION">Subtraction</option>
                <option value="MULTIPLICATION">Multiplication</option>
                <option value="DIVISION">Division</option>
                <option value="SQUARE_ROOT">Square Root</option>
                <option value="RANDOM_STRING">Random String</option>
              </Form.Control>
            </Form.Group>

            {operation !== "RANDOM_STRING" && (
              <>
                <Form.Group controlId="formValue1" className="mt-3">
                  <Form.Label>Number 1</Form.Label>
                  <Form.Control
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    required
                    placeholder="Enter first number"
                  />
                </Form.Group>

                <Form.Group controlId="formValue2" className="mt-3">
                  <Form.Label>Number 2</Form.Label>
                  <Form.Control
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    required={operation !== "SQUARE_ROOT"}
                    placeholder="Enter second number"
                    disabled={operation === "SQUARE_ROOT"} // Disable second input if square root is selected
                  />
                </Form.Group>
              </>
            )}

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={isLoading}
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
                "Execute operation"
              )}
            </Button>
          </Form>

          {showResult && operationResponse && (
            <Alert variant="success" className="mt-4">
              <Row className="mx-5">
                <Col md={6}>
                  {operationResponse.operationResult.replace(/"/g, "")}.
                </Col>
                <Col className="mx-5">
                  Your new balance is {operationResponse.amount}.
                </Col>
              </Row>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Operation
