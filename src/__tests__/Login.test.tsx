import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter as Router, useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/authContext"
import Login from "../pages/Login"

// Mock useAuthContext
jest.mock("../context/authContext", () => ({
  useAuthContext: jest.fn(),
}))

// Mock the entire react-router-dom module
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Keeps other functionalities intact
  useNavigate: jest.fn(), // Mock useNavigate hook
}))

describe("Login component", () => {
  const mockNavigate = jest.fn()

  // Cast the mocked useNavigate as jest.Mock
  const mockedUseNavigate = useNavigate as jest.Mock

  // Now mock the return value
  mockedUseNavigate.mockReturnValue(mockNavigate)

  const mockLogin = jest.fn()
  const mockIsAuthenticated = false

  beforeEach(() => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: mockIsAuthenticated,
    })

    // Mock useNavigate
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders the Login component", () => {
    render(
      <Router>
        <Login />
      </Router>
    )

    // Check if form elements are rendered
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  test("displays error if login fails", async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: "Invalid credentials" },
    })

    render(
      <Router>
        <Login />
      </Router>
    )

    const usernameInput = screen.getByPlaceholderText(/enter username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const loginButton = screen.getByRole("button", { name: /login/i })

    fireEvent.change(usernameInput, { target: { value: "testuser" } })
    fireEvent.change(passwordInput, { target: { value: "testpass" } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "testpass")
    })

    // Check if error message is displayed
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })

  test("redirects to home if user is authenticated", () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: true,
    })

    render(
      <Router>
        <Login />
      </Router>
    )

    expect(mockNavigate).toHaveBeenCalledWith("/home")
  })

  test("disables login button when username or password is missing", () => {
    render(
      <Router>
        <Login />
      </Router>
    )

    const loginButton = screen.getByRole("button", { name: /login/i })

    expect(loginButton).toBeDisabled()

    const usernameInput = screen.getByPlaceholderText(/enter username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    fireEvent.change(usernameInput, { target: { value: "testuser" } })
    fireEvent.change(passwordInput, { target: { value: "testpass" } })

    expect(loginButton).not.toBeDisabled()
  })

  test("displays loading state during login", async () => {
    render(
      <Router>
        <Login />
      </Router>
    )

    const usernameInput = screen.getByPlaceholderText(/enter username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const loginButton = screen.getByRole("button", { name: /login/i })

    fireEvent.change(usernameInput, { target: { value: "testuser" } })
    fireEvent.change(passwordInput, { target: { value: "testpass" } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(loginButton).toBeDisabled()
    })
  })

  test("navigates to the register page on button click", () => {
    render(
      <Router>
        <Login />
      </Router>
    )

    const registerButton = screen.getByRole("button", {
      name: /create account/i,
    })
    fireEvent.click(registerButton)

    expect(mockNavigate).toHaveBeenCalledWith("/register")
  })
})
