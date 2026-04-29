import { test, expect } from "@playwright/test";

test.describe("Habit Tracker PWA E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("shows splash screen on initial load", async ({ page }) => {
    const splashScreen = page.getByTestId("splash-screen");
    await expect(splashScreen).toBeVisible();
  });

  test("redirects to login when not authenticated", async ({ page }) => {
    await page.waitForNavigation();
    expect(page.url()).toContain("/login");
  });

  test("completes full signup flow", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("testuser@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();
    expect(page.url()).toContain("/dashboard");
  });

  test("completes login flow", async ({ page, context }) => {
    // First, create a user via signup
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("login-test@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();

    // Now logout and test login
    const logoutButton = page.getByTestId("logout-button");
    await logoutButton.click();
    await page.waitForNavigation();

    // Login with the created user
    const loginEmailInput = page.getByTestId("email-input");
    const loginPasswordInput = page.getByTestId("password-input");
    const loginButton = page.getByTestId("login-button");

    await loginEmailInput.fill("login-test@example.com");
    await loginPasswordInput.fill("password123");
    await loginButton.click();

    await page.waitForNavigation();
    expect(page.url()).toContain("/dashboard");
  });

  test("creates a new habit", async ({ page }) => {
    // Sign up first
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("habit-test@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();

    // Create a habit
    const newHabitButton = page.getByTestId("new-habit-button");
    await newHabitButton.click();

    const habitNameInput = page.getByTestId("habit-name-input");
    const submitButton = page.getByTestId("habit-submit-button");

    await habitNameInput.fill("drink water");
    await submitButton.click();

    // Verify habit appears
    const habitCard = page.getByTestId("habit-card-drink-water");
    await expect(habitCard).toBeVisible();
  });

  test("toggles habit completion", async ({ page }) => {
    // Sign up and create habit
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("toggle-test@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();

    // Create habit
    const newHabitButton = page.getByTestId("new-habit-button");
    await newHabitButton.click();

    const habitNameInput = page.getByTestId("habit-name-input");
    const submitButton = page.getByTestId("habit-submit-button");

    await habitNameInput.fill("exercise");
    await submitButton.click();

    // Toggle completion
    const completeButton = page.getByTestId("habit-complete-exercise");
    await completeButton.click();

    // Verify button shows "Done"
    await expect(completeButton).toContainText("Done");
  });

  test("calculates and displays streak", async ({ page }) => {
    // Sign up
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("streak-test@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();

    // Create habit
    const newHabitButton = page.getByTestId("new-habit-button");
    await newHabitButton.click();

    const habitNameInput = page.getByTestId("habit-name-input");
    const submitButton = page.getByTestId("habit-submit-button");

    await habitNameInput.fill("meditate");
    await submitButton.click();

    // Complete the habit
    const completeButton = page.getByTestId("habit-complete-meditate");
    await completeButton.click();

    // Verify streak is displayed
    const streakDisplay = page.getByTestId("habit-streak-meditate");
    await expect(streakDisplay).toContainText("1");
  });

  test("persists state after page reload", async ({ page }) => {
    // Sign up and create habit
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("persist-test@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();

    // Create habit
    const newHabitButton = page.getByTestId("new-habit-button");
    await newHabitButton.click();

    const habitNameInput = page.getByTestId("habit-name-input");
    const submitButton = page.getByTestId("habit-submit-button");

    await habitNameInput.fill("read");
    await submitButton.click();

    // Complete the habit
    const completeButton = page.getByTestId("habit-complete-read");
    await completeButton.click();

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify habit and completion persist
    const habitCard = page.getByTestId("habit-card-read");
    await expect(habitCard).toBeVisible();

    const reloadedCompleteButton = page.getByTestId("habit-complete-read");
    await expect(reloadedCompleteButton).toContainText("Done");
  });

  test("logout clears session", async ({ page }) => {
    // Sign up
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("logout-test@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();

    // Logout
    const logoutButton = page.getByTestId("logout-button");
    await logoutButton.click();

    await page.waitForNavigation();
    expect(page.url()).toContain("/login");

    // Try to access dashboard directly
    await page.goto("http://localhost:3000/dashboard");
    await page.waitForNavigation();
    expect(page.url()).toContain("/login");
  });

  test("shows empty state when no habits exist", async ({ page }) => {
    // Sign up
    await page.goto("http://localhost:3000/signup");

    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const confirmInput = page.getByTestId("confirm-password-input");
    const signupButton = page.getByTestId("signup-button");

    await emailInput.fill("empty-test@example.com");
    await passwordInput.fill("password123");
    await confirmInput.fill("password123");
    await signupButton.click();

    await page.waitForNavigation();

    // Verify empty state is shown
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
  });
});
