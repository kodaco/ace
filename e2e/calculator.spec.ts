import { test, expect } from "@playwright/test";
import { goto, waitForApp, calculate, clickFeature } from "./helpers";

test.beforeEach(async ({ page }) => {
  await goto(page);
  await waitForApp(page);
});

// ─── AI toggle ───────────────────────────────────────────────────────────────

test("ai toggle: Build with AI switch is off by default", async ({ page }) => {
  // MUI Switch uses role="switch"
  const sw = page.getByRole("switch", { name: /Build with AI/i });
  await expect(sw).not.toBeChecked();
});

test("ai toggle: enabling Build with AI updates hour display on features", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-user-auth"]');
  const hoursBefore = await item.locator(".MuiTypography-body2").filter({ hasText: /hrs/ }).textContent();
  await page.getByRole("switch", { name: /Build with AI/i }).click();
  const hoursAfter = await item.locator(".MuiTypography-body2").filter({ hasText: /hrs/ }).textContent();
  expect(hoursBefore).not.toEqual(hoursAfter);
});

test("ai toggle: toggling AI off reverts hour display", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-user-auth"]');
  const hoursBefore = await item.locator(".MuiTypography-body2").filter({ hasText: /hrs/ }).textContent();
  const sw = page.getByRole("switch", { name: /Build with AI/i });
  await sw.click(); // on
  await sw.click(); // off
  const hoursAfter = await item.locator(".MuiTypography-body2").filter({ hasText: /hrs/ }).textContent();
  expect(hoursBefore).toEqual(hoursAfter);
});

test("ai toggle: Build with AI info can be expanded", async ({ page }) => {
  await page.getByRole("button", { name: /Learn more about building with AI/i }).click();
  await expect(page.getByText(/faster to build, but plan for more upkeep/i)).toBeVisible();
});

// ─── Hourly rate ─────────────────────────────────────────────────────────────

test("hourly rate: Change Rate button opens the edit field", async ({ page }) => {
  await page.getByRole("button", { name: "Change Rate" }).click();
  await expect(page.getByRole("button", { name: "Set Rate" })).toBeVisible();
});

test("hourly rate: setting a new rate updates the display", async ({ page }) => {
  await page.getByRole("button", { name: "Change Rate" }).click();
  const input = page.locator('input[type="number"]').last();
  await input.fill("200");
  await page.getByRole("button", { name: "Set Rate" }).click();
  await expect(page.getByText("$200")).toBeVisible();
});

test("hourly rate: Cancel discards the new rate", async ({ page }) => {
  await page.getByRole("button", { name: "Change Rate" }).click();
  const input = page.locator('input[type="number"]').last();
  await input.fill("999");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("$999")).not.toBeVisible();
});

test("hourly rate: Enter key accepts the rate", async ({ page }) => {
  await page.getByRole("button", { name: "Change Rate" }).click();
  const input = page.locator('input[type="number"]').last();
  await input.fill("150");
  await input.press("Enter");
  await expect(page.getByText("$150")).toBeVisible();
});

test("hourly rate: Escape key cancels editing", async ({ page }) => {
  await page.getByRole("button", { name: "Change Rate" }).click();
  const input = page.locator('input[type="number"]').last();
  await input.fill("888");
  await input.press("Escape");
  await expect(page.getByText("$888")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Set Rate" })).not.toBeVisible();
});

// ─── Currency selector ────────────────────────────────────────────────────────

test("currency: USD is selected by default", async ({ page }) => {
  await expect(page.getByText("USD — $")).toBeVisible();
});

test("currency: switching to EUR updates the currency symbol", async ({ page }) => {
  await page.locator(".MuiSelect-select").click();
  await page.getByRole("option", { name: /EUR/ }).click();
  // The rate display updates to show € symbol
  await expect(page.getByText(/€\d/).or(page.getByText(/€\s/))).toBeVisible();
});

test("currency: switching to GBP updates the currency symbol", async ({ page }) => {
  await page.locator(".MuiSelect-select").click();
  await page.getByRole("option", { name: /GBP/ }).click();
  await expect(page.getByText(/£\d/).or(page.getByText(/£\s/))).toBeVisible();
});

test("currency: switching to CAD updates the currency symbol", async ({ page }) => {
  await page.locator(".MuiSelect-select").click();
  await page.getByRole("option", { name: /CAD/ }).click();
  // CAD symbol is "CA$"
  await expect(page.getByText(/CA\$/).first()).toBeVisible();
});

test("currency: switching to AUD updates the currency symbol", async ({ page }) => {
  await page.locator(".MuiSelect-select").click();
  await page.getByRole("option", { name: /AUD/ }).click();
  await expect(page.getByText(/A\$/).first()).toBeVisible();
});

// ─── Calculate ───────────────────────────────────────────────────────────────

test("calculate: clicking Calculate shows the results card", async ({ page }) => {
  await calculate(page);
  await expect(page.locator('[data-testid="estimate-results"]')).toBeVisible();
});

test("calculate: results show Estimate Summary heading", async ({ page }) => {
  await calculate(page);
  await expect(page.getByText("Estimate Summary")).toBeVisible();
});

test("calculate: results show a development cost", async ({ page }) => {
  await calculate(page);
  // Cost is displayed in an h4 heading
  await expect(page.locator('[data-testid="estimate-results"] h4')).toBeVisible();
});

test("calculate: results show an estimated timeframe", async ({ page }) => {
  await calculate(page);
  // The timeframe h6 heading contains weeks/months
  await expect(page.locator('[data-testid="estimate-results"] h6').first()).toBeVisible();
});

test("calculate: results show annual maintenance", async ({ page }) => {
  await calculate(page);
  await expect(page.getByText(/Estimated Annual Maintenance/i)).toBeVisible();
});

test("calculate: results show selected feature count", async ({ page }) => {
  await calculate(page);
  // "N feature(s) selected · $X/hr rate" summary line
  await expect(page.locator('[data-testid="estimate-results"]').getByText(/features? selected/)).toBeVisible();
});

test("calculate: changing a feature after calculating shows Recalculate button", async ({ page }) => {
  await calculate(page);
  await clickFeature(page, "user-auth"); // toggle
  await expect(page.locator('[data-testid="calculate-btn"]')).toHaveText(/Recalculate/);
});

test("calculate: Recalculate produces fresh results", async ({ page }) => {
  await calculate(page);
  await clickFeature(page, "user-auth");
  await page.click('[data-testid="calculate-btn"]');
  await page.waitForFunction(() => {
    const btn = document.querySelector('[data-testid="calculate-btn"]');
    return btn && !btn.textContent?.includes("Calculating");
  }, { timeout: 8000 });
  await expect(page.locator('[data-testid="estimate-results"]')).toBeVisible();
});

// ─── Estimate mode (Low / Mid / High) ────────────────────────────────────────

test("estimate mode: Midpoint is active by default after calculating", async ({ page }) => {
  await calculate(page);
  const midBtn = page.getByRole("button", { name: "Midpoint" });
  await expect(midBtn).toHaveClass(/Mui-selected/);
});

test("estimate mode: switching to Low changes the displayed cost", async ({ page }) => {
  // Select multiple features to get a meaningful range
  await clickFeature(page, "user-auth");
  await clickFeature(page, "user-profiles");
  await calculate(page);

  // Main cost is in the h4 heading
  const costHeading = page.locator('[data-testid="estimate-results"] h4').first();
  const midCost = await costHeading.textContent();

  await page.getByRole("button", { name: "Low" }).click();
  await page.waitForTimeout(400); // mode switch animation
  const lowCost = await costHeading.textContent();
  expect(lowCost).not.toEqual(midCost);
});

test("estimate mode: switching to High changes the displayed cost", async ({ page }) => {
  await clickFeature(page, "user-auth");
  await clickFeature(page, "user-profiles");
  await calculate(page);

  const costHeading = page.locator('[data-testid="estimate-results"] h4').first();
  const midCost = await costHeading.textContent();

  await page.getByRole("button", { name: "High" }).click();
  await page.waitForTimeout(400);
  const highCost = await costHeading.textContent();
  expect(highCost).not.toEqual(midCost);
});

// ─── Details panel ────────────────────────────────────────────────────────────

test("details: expanding 'View cost range & details' shows cost range", async ({ page }) => {
  await calculate(page);
  await page.click('[data-testid="details-toggle"]');
  await expect(page.getByText(/Development cost:/)).toBeVisible();
  await expect(page.getByText(/Timeframe:/)).toBeVisible();
  await expect(page.getByText(/Development hours:/)).toBeVisible();
  await expect(page.getByText(/Annual maintenance:/)).toBeVisible();
});

test("details: cost breakdown bars render when multiple features are selected", async ({ page }) => {
  await clickFeature(page, "user-auth");
  await clickFeature(page, "user-profiles");
  await calculate(page);
  await page.click('[data-testid="details-toggle"]');
  await expect(page.getByText("Hours by feature")).toBeVisible();
});

test("details: collapsing the panel hides the cost range", async ({ page }) => {
  await calculate(page);
  await page.click('[data-testid="details-toggle"]');
  await page.click('[data-testid="details-toggle"]');
  await expect(page.getByText("Development cost:")).not.toBeVisible();
});

// ─── Results action buttons ───────────────────────────────────────────────────

test("actions: Copy shareable link shows snackbar confirmation", async ({ page }) => {
  await calculate(page);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: /Copy shareable link/ }).click();
  await expect(page.getByText("Link copied to clipboard")).toBeVisible();
});

test("actions: Save estimate button reveals the name input", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await expect(page.getByPlaceholder(/Name this estimate/)).toBeVisible();
});

test("actions: saving with a name shows 'Saved!' confirmation", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByPlaceholder(/Name this estimate/).fill("My Test Estimate");
  // Use exact: true to avoid matching "Save as PDF", "Save estimate", "Saved (0)"
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved!")).toBeVisible();
});

test("actions: Save button is disabled when name is empty", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await expect(page.getByRole("button", { name: "Save", exact: true })).toBeDisabled();
});

test("actions: Cancel on save input hides the input", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByPlaceholder(/Name this estimate/)).not.toBeVisible();
});

test("actions: Enter key in save input confirms save", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByPlaceholder(/Name this estimate/).fill("Keyboard Save");
  await page.getByPlaceholder(/Name this estimate/).press("Enter");
  await expect(page.getByText("Saved!")).toBeVisible();
});

// ─── Saved estimates drawer ───────────────────────────────────────────────────

test("saved drawer: opens with empty state message when no estimates saved", async ({ page }) => {
  await page.click('[data-testid="saved-btn"]');
  await expect(page.getByText("No saved estimates yet.")).toBeVisible();
});

test("saved drawer: closes when X button is clicked", async ({ page }) => {
  await page.click('[data-testid="saved-btn"]');
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("No saved estimates yet.")).not.toBeVisible();
});

test("saved drawer: saved estimate appears in the drawer", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByPlaceholder(/Name this estimate/).fill("MVP Build");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await page.click('[data-testid="saved-btn"]');
  await expect(page.getByText("MVP Build")).toBeVisible();
});

test("saved drawer: saved estimate shows feature count and date", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByPlaceholder(/Name this estimate/).fill("Details Test");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await page.click('[data-testid="saved-btn"]');
  // Drawer entry format: "N feature(s) · $X midpoint · date"
  await expect(page.getByText(/\d+ features? ·/)).toBeVisible();
});

test("saved drawer: restoring an estimate closes the drawer and reloads state", async ({ page }) => {
  await clickFeature(page, "user-auth");
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByPlaceholder(/Name this estimate/).fill("Restore Test");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  // Reset state: deselect user-auth so we can verify it gets restored
  await clickFeature(page, "user-auth");
  await page.click('[data-testid="saved-btn"]');
  await page.getByRole("button", { name: "Restore estimate" }).click();

  // Drawer should close
  await expect(page.getByText("Restore Test")).not.toBeVisible();
  // The feature should be re-selected
  const checkbox = page.locator('[data-testid="feature-item-user-auth"] input[type="checkbox"]');
  await expect(checkbox).toBeChecked();
});

test("saved drawer: deleting a saved estimate removes it", async ({ page }) => {
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByPlaceholder(/Name this estimate/).fill("Delete This");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await page.click('[data-testid="saved-btn"]');
  await page.getByRole("button", { name: "Delete saved estimate" }).click();
  await expect(page.getByText("Delete This")).not.toBeVisible();
  await expect(page.getByText("No saved estimates yet.")).toBeVisible();
});

test("saved drawer: Saved button count updates after saving", async ({ page }) => {
  await expect(page.locator('[data-testid="saved-btn"]')).toContainText("Saved (0)");
  await calculate(page);
  await page.getByRole("button", { name: /Save estimate/ }).click();
  await page.getByPlaceholder(/Name this estimate/).fill("Count Test");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.locator('[data-testid="saved-btn"]')).toContainText("Saved (1)");
});
