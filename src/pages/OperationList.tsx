// src/pages/HomePage.js
import { useEffect } from "react"
import { Container, Row, Spinner, Table } from "react-bootstrap"
import { useUserContext } from "../context/userContext"

const OperationList = () => {
  const { operations, getOperations, isLoading } = useUserContext()

  useEffect(() => {
    if (!operations) {
      getOperations()
    }
  }, [getOperations, operations])

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

  const capitalize = (str: string) =>
    str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()

  return (
    <>
      <Row className="mx-1 mt-5 mb-3 fw-bold">
        Operations list which you have already done on this APP
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Operation ID</th>
            <th>Operation Type</th>
            <th>Operation Cost</th>
            <th>User Balance</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {operations &&
            operations.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.operationId}</td>
                <td>{capitalize(record.operationType.replaceAll("_", " "))}</td>
                <td>{record.operationCost}</td>
                <td>{record.userBalance}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>{" "}
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  )
}

export default OperationList
