import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { useAuthContext } from "../context/authContext"
import { useUserContext } from "../context/userContext"
import Layout from "../components/Layout/Layout"

// Mock the contexts
jest.mock("../context/authContext")
jest.mock("../context/userContext")

const mockNavigate = jest.fn()

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("Layout Component", () => {
  const mockLogout = jest.fn()
  const mockClearContextData = jest.fn()

  beforeEach(() => {
    ;(useAuthContext as jest.Mock)
      .mockReturnValue({ logout: mockLogout })(useUserContext as jest.Mock)
      .mockReturnValue({
        clearContextData: mockClearContextData,
        currentBalance: 100,
        isLoading: false,
      })
    sessionStorage.setItem("jwt_token", "mockToken")
  })

  afterEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
  })

  test("renders Layout with children", () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Child Content</div>
        </Layout>
      </BrowserRouter>
    )
    expect(screen.getByText("Test Child Content")).toBeInTheDocument()
  })

  test("shows the current balance", () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Child Content</div>
        </Layout>
      </BrowserRouter>
    )

    expect(screen.getByText(/Current balance: 100/i)).toBeInTheDocument()
  })

  test("calls logout and clears context on log out", () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Child Content</div>
        </Layout>
      </BrowserRouter>
    )

    const logoutButton = screen.getByRole("button", { name: /log out/i })
    fireEvent.click(logoutButton)

    expect(mockClearContextData).toHaveBeenCalled()
    expect(mockLogout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith("/")
  })

  test("displays the spinner when loading", () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      clearContextData: mockClearContextData,
      currentBalance: undefined,
      isLoading: true,
    })

    render(
      <BrowserRouter>
        <Layout>
          <div>Test Child Content</div>
        </Layout>
      </BrowserRouter>
    )

    expect(screen.getByRole("status")).toBeInTheDocument()
  })
})
