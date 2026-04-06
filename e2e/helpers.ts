import { Page, expect } from "@playwright/test";

export const APP_URL = "/ace";

/** Navigate to the app home page */
export async function goto(page: Page) {
  await page.goto(APP_URL);
}

/** Wait for the app to finish its initial render */
export async function waitForApp(page: Page) {
  await page.waitForSelector('[data-testid="calculate-btn"]');
}

/**
 * Run an estimate and wait for the results card to appear.
 * Waits for the loading spinner to disappear before returning.
 */
export async function calculate(page: Page) {
  await page.click('[data-testid="calculate-btn"]');
  // Wait for skeleton/loading to finish — results card appears
  await expect(page.locator('[data-testid="estimate-results"]')).toBeVisible({ timeout: 5000 });
  await page.waitForFunction(() => {
    const btn = document.querySelector('[data-testid="calculate-btn"]');
    return btn && !btn.textContent?.includes("Calculating");
  }, { timeout: 8000 });
}

/** Click the header of a feature category group to toggle it open/closed */
export async function clickCategoryHeader(page: Page, category: string) {
  await page.click(`[data-testid="category-header-${category}"]`);
}

/** Click a feature item card to toggle its selection */
export async function clickFeature(page: Page, featureId: string) {
  await page.click(`[data-testid="feature-item-${featureId}"]`);
}
