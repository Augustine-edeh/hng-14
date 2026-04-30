import { expect, test } from "@playwright/test";

const user = {
  id: "user-e2e",
  email: "e2e@example.com",
  password: "password123",
  createdAt: "2026-04-29T00:00:00.000Z",
};

async function clearStorage(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.evaluate(() => localStorage.clear());
}

async function seedUser(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.evaluate((seedUser) => {
    localStorage.setItem("habit-tracker-users", JSON.stringify([seedUser]));
  }, user);
}

async function seedSession(page: import("@playwright/test").Page) {
  await seedUser(page);
  await page.evaluate((seedUser) => {
    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify({ userId: seedUser.id, email: seedUser.email }),
    );
  }, user);
}

async function createHabit(page: import("@playwright/test").Page, name: string) {
  await page.getByTestId("create-habit-button").click();
  await page.getByTestId("habit-name-input").fill(name);
  await page.getByTestId("habit-save-button").click();
}

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await seedSession(page);
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("signup@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await seedUser(page);
    await page.evaluate((seedUser) => {
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "habit-visible",
            userId: seedUser.id,
            name: "Visible Habit",
            description: "",
            frequency: "daily",
            createdAt: new Date().toISOString(),
            completions: [],
          },
          {
            id: "habit-hidden",
            userId: "other-user",
            name: "Hidden Habit",
            description: "",
            frequency: "daily",
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ]),
      );
    }, user);

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill(user.email);
    await page.getByTestId("auth-login-password").fill(user.password);
    await page.getByTestId("auth-login-submit").click();

    await expect(page.getByTestId("habit-card-visible-habit")).toBeVisible();
    await expect(page.getByTestId("habit-card-hidden-habit")).toHaveCount(0);
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await seedSession(page);
    await page.goto("/dashboard");

    await createHabit(page, "Drink Water");

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await seedSession(page);
    await page.goto("/dashboard");
    await createHabit(page, "Exercise");

    await page.getByTestId("habit-complete-exercise").click();

    await expect(page.getByTestId("habit-streak-exercise")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await seedSession(page);
    await page.goto("/dashboard");
    await createHabit(page, "Read Books");
    await page.getByTestId("habit-complete-read-books").click();

    await page.reload();

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();
    await expect(page.getByTestId("habit-complete-read-books")).toContainText(
      "Done",
    );
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await seedSession(page);
    await page.goto("/dashboard");

    await page.getByTestId("auth-logout-button").click();

    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    context,
    page,
  }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      await navigator.serviceWorker?.ready;
    });

    await context.setOffline(true);
    await page.goto("/login");

    await expect(page.getByTestId("auth-login-submit")).toBeVisible();
    await context.setOffline(false);
  });
});
