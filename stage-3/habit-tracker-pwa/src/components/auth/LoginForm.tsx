"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push("/dashboard");
      return;
    }

    setError(result.error || "Invalid email or password");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-lg border bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      {error && (
        <p
          data-testid="error-message"
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          required
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block text-sm font-medium"
        >
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          required
        />
      </div>

      <button
        data-testid="auth-login-submit"
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Need an account?{" "}
        <Link href="/signup" className="font-medium text-blue-700 underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
