import { Container, Navbar, Nav, Button, Spinner } from "react-bootstrap"
import { useAuthContext } from "../../context/authContext"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/userContext"

const Layout = ({ children }: any) => {
  const { logout } = useAuthContext()
  const { currentBalance, isLoading } = useUserContext()
  const navigate = useNavigate()

  const doLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div>
      {sessionStorage.getItem("jwt_token") && (
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
              <Button variant="dark" onClick={() => navigate("/home")}>
                Calculator App
              </Button>
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link>
                <Button variant="dark" onClick={() => navigate("/home")}>
                  Home
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button variant="dark" onClick={() => navigate("/operation")}>
                  New Operation
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button variant="dark" onClick={() => navigate("/history")}>
                  History
                </Button>
              </Nav.Link>
            </Nav>
            {!isLoading && (
              <div className="text-white fw-bold me-5">
                Current balance:{" "}
                {currentBalance !== undefined ? (
                  currentBalance
                ) : (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </div>
            )}
            <Button variant="light" onClick={() => doLogout()}>
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
