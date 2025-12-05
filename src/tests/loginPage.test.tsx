import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, beforeEach, vi, expect } from "vitest";

// Component under test
import LoginPage from "../components/Pages/loginPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

//Mock Backend
const mockFetchUsers = vi.fn();
const mockCheckPassword = vi.fn();
const mockUserIdFrom = vi.fn();

vi.mock("../../services/user.service", () => ({
  fetchUsers: () => mockFetchUsers(),
  checkPassword: (...args: any[]) => mockCheckPassword(...args),
  userIdFrom: (...args: any[]) => mockUserIdFrom(...args),
}));


// Render helper
const renderLogin = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );


describe("Test when user is not logged in", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    renderLogin();
  });

  test("renders username and password fields", () => {
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  test("renders login and cancel buttons", () => {
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("renders sign-up button", () => {
    expect(screen.getByText("No account? Sign Up Here")).toBeInTheDocument();
  });

  //Error handling
  test("displays error if username is empty", async () => {
    const user = userEvent.setup();
    const submitBtn = screen.getByText("Sign in");

    await user.click(submitBtn);

    expect(screen.getByText("Please enter a username")).toBeInTheDocument();
  });

  test("displays error if password is empty", async () => {
    const user = userEvent.setup();
    const usernameInput = screen.getByLabelText("Username");
    const submitBtn = screen.getByText("Sign in");

    await user.type(usernameInput, "pedro");
    await user.click(submitBtn);

    expect(screen.getByText("Please enter a password")).toBeInTheDocument();
  });

  //user not found
  test("user that doesn't exist shows error", async () => {
    const user = userEvent.setup();

    mockFetchUsers.mockResolvedValueOnce([]); // no users exist

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(usernameInput, "pedro");
    await user.type(passwordInput, "123");

    await user.click(screen.getByText("Sign in"));

    expect(
      screen.getByText("User does not exist, try signing up first")
    ).toBeInTheDocument();
  });
});