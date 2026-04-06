import { test, expect } from "@playwright/test";
import { goto, waitForApp } from "./helpers";

test.beforeEach(async ({ page }) => {
  await goto(page);
  await waitForApp(page);
});

test("compare mode: Compare two estimates button is visible", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Compare two estimates/i })).toBeVisible();
});

test("compare mode: clicking Compare shows two labeled panels", async ({ page }) => {
  await page.getByRole("button", { name: /Compare two estimates/i }).click();
  await expect(page.getByText("Estimate A")).toBeVisible();
  await expect(page.getByText("Estimate B")).toBeVisible();
});

test("compare mode: both panels have their own Calculate buttons", async ({ page }) => {
  await page.getByRole("button", { name: /Compare two estimates/i }).click();
  const calculateBtns = page.locator('[data-testid="calculate-btn"]');
  await expect(calculateBtns).toHaveCount(2);
});

test("compare mode: both panels have independent platform selectors", async ({ page }) => {
  await page.getByRole("button", { name: /Compare two estimates/i }).click();
  const platformSelectors = page.locator('[data-testid="platform-web"]');
  await expect(platformSelectors).toHaveCount(2);
});

test("compare mode: Estimate A and B have independent feature selections", async ({ page }) => {
  await page.getByRole("button", { name: /Compare two estimates/i }).click();

  // Select user-auth in Estimate A — locate via the "Estimate A" heading
  const panelA = page.locator('.MuiContainer-root', { hasText: 'Estimate A' });
  await panelA.locator('[data-testid="feature-item-user-auth"]').click();

  // Estimate B's checkbox should remain unchecked
  const panelB = page.locator('.MuiContainer-root', { hasText: 'Estimate B' });
  const checkboxB = panelB.locator('[data-testid="feature-item-user-auth"] input[type="checkbox"]');
  await expect(checkboxB).not.toBeChecked();
});

test("compare mode: both panels can calculate independently", async ({ page }) => {
  await page.getByRole("button", { name: /Compare two estimates/i }).click();

  // Calculate in Estimate A
  const calcBtns = page.locator('[data-testid="calculate-btn"]');
  await calcBtns.first().click();
  await page.waitForFunction(() => {
    const btns = document.querySelectorAll('[data-testid="calculate-btn"]');
    return btns[0] && !btns[0].textContent?.includes("Calculating");
  }, { timeout: 8000 });

  const results = page.locator('[data-testid="estimate-results"]');
  await expect(results.first()).toBeVisible();

  // Estimate B has not been calculated — its results card should not exist in the DOM
  const panelB = page.locator('.MuiContainer-root', { hasText: 'Estimate B' });
  await expect(panelB.locator('[data-testid="estimate-results"]')).not.toBeAttached();
});

test("compare mode: Exit compare mode returns to single panel", async ({ page }) => {
  await page.getByRole("button", { name: /Compare two estimates/i }).click();
  await expect(page.getByText("Estimate A")).toBeVisible();

  await page.getByRole("button", { name: /Exit compare mode/i }).click();
  await expect(page.getByText("Estimate A")).not.toBeVisible();
  await expect(page.getByText("Estimate B")).not.toBeVisible();
  // Single Calculate button remains
  await expect(page.locator('[data-testid="calculate-btn"]')).toHaveCount(1);
});
