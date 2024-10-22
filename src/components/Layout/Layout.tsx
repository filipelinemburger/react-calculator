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
            <Navbar.Brand href="/react-calculator/home">
              Calculator App
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/react-calculator/home">Home</Nav.Link>
              <Nav.Link href="/react-calculator/operation">
                New Operation
              </Nav.Link>
              <Nav.Link href="/react-calculator/history">History</Nav.Link>
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
