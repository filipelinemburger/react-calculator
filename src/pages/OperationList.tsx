import { useEffect, useState } from "react"
import { Container, Row, Spinner, Table, Button } from "react-bootstrap"
import { useUserContext } from "../context/userContext"

const OperationList = () => {
  const { operations, getOperations, isLoading, totalPages } = useUserContext()
  const [page, setPage] = useState(0) // Track the current page
  const [size] = useState(10) // Track the size of each page

  useEffect(() => {
    fetchOperations(page, size)
  }, [page]) // Refetch when page or size changes

  const fetchOperations = async (page: number, size: number) => {
    await getOperations(page, size) // Fetch with pagination
  }

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

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between my-3">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
          }
          disabled={page + 1 >= totalPages}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default OperationList
