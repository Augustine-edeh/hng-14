import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { login, signup } from "@/lib/auth";
import { getSession } from "@/lib/storage";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("submits the signup form and creates a session", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(getSession()).toEqual(
        expect.objectContaining({ email: "new@example.com" }),
      );
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    signup("taken@example.com", "password123");
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "taken@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "User already exists",
    );
  });

  it("submits the login form and stores the active session", async () => {
    signup("login@example.com", "password123");
    localStorage.removeItem("habit-tracker-session");
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "login@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(login("login@example.com", "password123").success).toBe(true);
      expect(getSession()).toEqual(
        expect.objectContaining({ email: "login@example.com" }),
      );
    });
  });

  it("shows an error for invalid login credentials", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "missing@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password",
    );
  });
});
