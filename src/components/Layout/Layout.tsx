import { Container, Navbar, Nav, Button, Spinner } from "react-bootstrap"
import { JWT_TOKEN, useAuthContext } from "../../context/authContext"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import { useCallback, ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuthContext()
  const { setCurrentUser, clearContextData, currentBalance, isLoading } =
    useUserContext()
  const navigate = useNavigate()

  const jwtToken = sessionStorage.getItem(JWT_TOKEN)

  const doLogout = useCallback(() => {
    clearContextData()
    logout()
    navigate("/")
    setCurrentUser(undefined)
  }, [clearContextData, logout, navigate, setCurrentUser])

  return (
    <div>
      {jwtToken && (
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
              <Button
                variant="dark"
                onClick={() => navigate("/home")}
                aria-label="Go to Home"
              >
                Calculator App
              </Button>
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link>
                <Button
                  variant="dark"
                  onClick={() => navigate("/home")}
                  aria-label="Go to Home"
                >
                  Home
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button
                  id="operationButtonId"
                  variant="dark"
                  onClick={() => navigate("/operation")}
                  aria-label="New Operation"
                >
                  New Operation
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button
                  variant="dark"
                  onClick={() => navigate("/history")}
                  aria-label="View History"
                >
                  History
                </Button>
              </Nav.Link>
            </Nav>
            <div className="text-white fw-bold me-5">
              Current balance:{" "}
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                currentBalance ?? "N/A"
              )}
            </div>
            <Button variant="light" onClick={doLogout} aria-label="Log out">
              Log out
            </Button>
          </Container>
        </Navbar>
      )}

      <Container className="mt-4">{children}</Container>
    </div>
  )
}

export default Layout
