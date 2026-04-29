import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import { signup, login, logout, getAuthSession } from "@/lib/auth";

describe("Auth Flow Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("allows signup with new email", () => {
    const result = signup("test@example.com", "password123");
    expect(result.success).toBe(true);
  });

  it("prevents signup with duplicate email", () => {
    signup("test@example.com", "password123");
    const result = signup("test@example.com", "password456");
    expect(result.success).toBe(false);
    expect(result.error).toBe("User already exists");
  });

  it("allows login with correct credentials", () => {
    signup("test@example.com", "password123");
    logout();
    const result = login("test@example.com", "password123");
    expect(result.success).toBe(true);
    expect(getAuthSession()).not.toBeNull();
  });

  it("prevents login with incorrect password", () => {
    signup("test@example.com", "password123");
    logout();
    const result = login("test@example.com", "wrongpassword");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid email or password");
  });

  it("clears session on logout", () => {
    signup("test@example.com", "password123");
    logout();
    expect(getAuthSession()).toBeNull();
  });

  it("LoginForm submits with email and password", async () => {
    signup("test@example.com", "password123");
    logout();

    const { container } = render(<LoginForm />);
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getAuthSession()).not.toBeNull();
    });
  });

  it("SignupForm shows error for duplicate email", async () => {
    signup("existing@example.com", "password123");

    render(<SignupForm />);
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const confirmInput = screen.getByTestId("confirm-password-input");
    const submitButton = screen.getByTestId("signup-button");

    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMsg = screen.getByTestId("error-message");
      expect(errorMsg).toHaveTextContent("User already exists");
    });
  });

  it("LoginForm shows error for invalid credentials", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("login-button");

    fireEvent.change(emailInput, {
      target: { value: "nonexistent@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMsg = screen.getByTestId("error-message");
      expect(errorMsg).toHaveTextContent("Invalid email or password");
    });
  });
});
