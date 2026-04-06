import { test, expect } from "@playwright/test";
import { goto, waitForApp, calculate, clickFeature } from "./helpers";

test.beforeEach(async ({ page }) => {
  await goto(page);
  await waitForApp(page);
});

test("url sharing: URL updates with ?e= param as state changes", async ({ page }) => {
  await clickFeature(page, "user-auth");
  const url = page.url();
  expect(url).toContain("?e=");
});

test("url sharing: state encodes feature selection", async ({ page }) => {
  const urlBefore = page.url();
  await clickFeature(page, "user-auth");
  const urlAfter = page.url();
  expect(urlBefore).not.toEqual(urlAfter);
});

test("url sharing: navigating to a shared URL restores feature selections", async ({ page }) => {
  await clickFeature(page, "user-auth");
  await clickFeature(page, "user-profiles");
  const sharedUrl = page.url();

  const newPage = await page.context().newPage();
  await newPage.goto(sharedUrl);
  await waitForApp(newPage);

  const checkbox = newPage.locator('[data-testid="feature-item-user-auth"] input[type="checkbox"]');
  await expect(checkbox).toBeChecked();
  const checkbox2 = newPage.locator('[data-testid="feature-item-user-profiles"] input[type="checkbox"]');
  await expect(checkbox2).toBeChecked();
  await newPage.close();
});

test("url sharing: shared URL auto-calculates and shows results", async ({ page }) => {
  // Select features and calculate to get a URL with state
  await clickFeature(page, "user-auth");
  await calculate(page);
  const sharedUrl = page.url();

  // Open in a new page — should auto-calculate on load
  const newPage = await page.context().newPage();
  await newPage.goto(sharedUrl);
  await waitForApp(newPage);

  // Results should appear automatically without clicking Calculate
  await expect(newPage.locator('[data-testid="estimate-results"]')).toBeVisible({ timeout: 8000 });
  await newPage.close();
});

test("url sharing: shared URL scrolls to results after auto-calculating", async ({ page }) => {
  await clickFeature(page, "user-auth");
  await calculate(page);
  const sharedUrl = page.url();

  const newPage = await page.context().newPage();
  await newPage.goto(sharedUrl);
  await waitForApp(newPage);

  // Wait for results to render
  await expect(newPage.locator('[data-testid="estimate-results"]')).toBeVisible({ timeout: 8000 });

  // The estimate-output element should be in view (its bounding box top should be near 0 after scroll)
  const boundingBox = await newPage.locator('#estimate-output').boundingBox();
  expect(boundingBox).not.toBeNull();
  // After scrollIntoView, the top of the element should be close to the top of the viewport
  // After scrollIntoView the element top should be near the viewport top (within one viewport height)
  const viewportHeight = newPage.viewportSize()?.height ?? 768;
  expect(boundingBox!.y).toBeLessThan(viewportHeight);
  await newPage.close();
});

test("url sharing: navigating to a shared URL restores hourly rate", async ({ page }) => {
  await page.getByRole("button", { name: "Change Rate" }).click();
  const input = page.locator('input[type="number"]').last();
  await input.fill("175");
  await input.press("Enter");
  const sharedUrl = page.url();

  const newPage = await page.context().newPage();
  await newPage.goto(sharedUrl);
  await waitForApp(newPage);

  await expect(newPage.getByText("$175")).toBeVisible();
  await newPage.close();
});

test("url sharing: navigating to a shared URL restores AI toggle state", async ({ page }) => {
  await page.getByRole("switch", { name: /Build with AI/i }).click();
  const sharedUrl = page.url();

  const newPage = await page.context().newPage();
  await newPage.goto(sharedUrl);
  await waitForApp(newPage);

  const sw = newPage.getByRole("switch", { name: /Build with AI/i });
  await expect(sw).toBeChecked();
  await newPage.close();
});

test("url sharing: Copy shareable link copies the current URL", async ({ page }) => {
  await calculate(page);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  const currentUrl = page.url();
  await page.getByRole("button", { name: /Copy shareable link/ }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toEqual(currentUrl);
});
