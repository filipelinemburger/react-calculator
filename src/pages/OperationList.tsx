import { useEffect, useState } from "react"
import { Container, Row, Spinner, Table, Button } from "react-bootstrap"
import { useUserContext } from "../context/userContext"
import { JWT_TOKEN } from "../context/authContext"
import axios from "axios"

const OperationList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL
  const {
    operations,
    getOperations,
    setOperations,
    isLoading,
    totalPages,
    setIsLoading,
    refreshUserStats,
  } = useUserContext()
  const [page, setPage] = useState(0)
  const [size] = useState(10)

  useEffect(() => {
    fetchOperations(page, size)
  }, [page])

  const fetchOperations = async (page: number, size: number) => {
    await getOperations(page, size)
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

  const deleteRecord = async (recordId: number) => {
    try {
      setIsLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(JWT_TOKEN)}`,
      }
      const response: any = await axios.delete(
        `${baseUrl}/operation?recordId=${recordId}`,
        {
          headers: headers,
        }
      )
      if (response.status === 200) {
        setPage(0)
        await fetchOperations(page, size)
        setOperations(operations?.filter((item) => item.id !== recordId))
        await refreshUserStats()
      }
    } catch (error: any) {
      console.error("Failed to get current balance", error)
    } finally {
      setIsLoading(false)
    }
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {operations &&
            operations.map((record, index) => (
              <tr key={record.id || index}>
                <td>{record.id}</td>
                <td>{record.operationId}</td>
                <td>{capitalize(record.operationType.replaceAll("_", " "))}</td>
                <td>{record.operationCost}</td>
                <td>{record.userBalance}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <th>
                  <Button
                    variant="light"
                    onClick={() => deleteRecord(record.id)}
                  >
                    Delete
                  </Button>
                </th>
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
