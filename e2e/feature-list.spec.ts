import { test, expect } from "@playwright/test";
import { goto, waitForApp, clickCategoryHeader, clickFeature } from "./helpers";

test.beforeEach(async ({ page }) => {
  await goto(page);
  await waitForApp(page);
});

// ─── Category accordion defaults ─────────────────────────────────────────────

test("feature list: Core category is open by default", async ({ page }) => {
  const core = page.locator('[data-testid="category-group-core"]');
  await expect(core.locator('[data-testid="feature-item-ui-ux-design"]')).toBeVisible();
});

test("feature list: Communication category starts collapsed", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-push-notifications"]');
  await expect(item).not.toBeVisible();
});

test("feature list: Commerce category starts collapsed", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-payments"]');
  await expect(item).not.toBeVisible();
});

test("feature list: Data category starts collapsed", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-search"]');
  await expect(item).not.toBeVisible();
});

test("feature list: Platform category starts collapsed", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-file-uploads"]');
  await expect(item).not.toBeVisible();
});

test("feature list: Advanced category starts collapsed", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-biometric-auth"]');
  await expect(item).not.toBeVisible();
});

// ─── Expand / collapse categories ────────────────────────────────────────────

test("feature list: clicking Communication header expands it", async ({ page }) => {
  await clickCategoryHeader(page, "communication");
  await expect(page.locator('[data-testid="feature-item-push-notifications"]')).toBeVisible();
});

test("feature list: clicking an open category header collapses it", async ({ page }) => {
  // Core is open by default
  await clickCategoryHeader(page, "core");
  await expect(page.locator('[data-testid="feature-item-ui-ux-design"]')).not.toBeVisible();
});

test("feature list: Expand All expands detail panels within open categories", async ({ page }) => {
  // Core is open by default — Expand All expands detail panels within it
  await page.getByRole("button", { name: "Expand All" }).click();
  await expect(
    page.locator('[data-testid="feature-item-user-auth"]').getByText(/Estimated range/)
  ).toBeVisible();
});

test("feature list: Collapse All collapses expanded detail panels", async ({ page }) => {
  // "Expand All" expands all panels → button changes to "Collapse All"
  await page.getByRole("button", { name: "Expand All" }).click();
  await expect(
    page.locator('[data-testid="feature-item-user-auth"]').getByText(/Estimated range/)
  ).toBeVisible();
  // Now "Collapse All" appears since all are expanded
  await page.getByRole("button", { name: "Collapse All" }).click();
  await expect(
    page.locator('[data-testid="feature-item-user-auth"]').getByText(/Estimated range/)
  ).not.toBeVisible();
});

// ─── Feature toggling ─────────────────────────────────────────────────────────

test("feature list: toggling a feature on selects it", async ({ page }) => {
  await clickFeature(page, "user-auth");
  // Checkbox inside the card should be checked
  const checkbox = page.locator('[data-testid="feature-item-user-auth"] input[type="checkbox"]');
  await expect(checkbox).toBeChecked();
});

test("feature list: toggling a selected feature off deselects it", async ({ page }) => {
  await clickFeature(page, "user-auth"); // on
  await clickFeature(page, "user-auth"); // off
  const checkbox = page.locator('[data-testid="feature-item-user-auth"] input[type="checkbox"]');
  await expect(checkbox).not.toBeChecked();
});

test("feature list: UI/UX Design is always-active and shows 'Always Included' chip", async ({ page }) => {
  const item = page.locator('[data-testid="feature-item-ui-ux-design"]');
  await expect(item.getByText("Always Included")).toBeVisible();
  // No checkbox present for locked items
  await expect(item.locator('input[type="checkbox"]')).not.toBeAttached();
});

test("feature list: selecting a feature in a collapsed category shows badge on header", async ({ page }) => {
  // Commerce is collapsed — select via Select All then verify badge
  await page.getByRole("button", { name: "Select All" }).click();
  const badge = page.locator('[data-testid="category-header-communication"] .MuiChip-root');
  await expect(badge).toBeVisible();
});

test("feature list: Select All selects every feature", async ({ page }) => {
  await page.getByRole("button", { name: "Select All" }).click();
  // Core is open — user-auth should be checked immediately
  const checkbox = page.locator('[data-testid="feature-item-user-auth"] input[type="checkbox"]');
  await expect(checkbox).toBeChecked();
  // Open Communication to verify push-notifications is selected too
  await clickCategoryHeader(page, "communication");
  const pushCheckbox = page.locator('[data-testid="feature-item-push-notifications"] input[type="checkbox"]');
  await expect(pushCheckbox).toBeChecked();
});

test("feature list: Deselect All leaves only always-active features", async ({ page }) => {
  await page.getByRole("button", { name: "Select All" }).click();
  await page.getByRole("button", { name: "Deselect All" }).click();
  // User auth should be unchecked
  const checkbox = page.locator('[data-testid="feature-item-user-auth"] input[type="checkbox"]');
  await expect(checkbox).not.toBeChecked();
  // UI/UX Design is still shown as always-included
  await expect(page.locator('[data-testid="feature-item-ui-ux-design"]').getByText("Always Included")).toBeVisible();
});

// ─── Feature expand (details panel) ─────────────────────────────────────────

test("feature list: clicking expand icon shows feature details", async ({ page }) => {
  const expandBtn = page.locator('[data-testid="feature-item-user-auth"]').getByRole("button", { name: "View details" });
  await expandBtn.click();
  // Details panel should contain hour range text
  await expect(page.locator('[data-testid="feature-item-user-auth"]').getByText(/Estimated range/)).toBeVisible();
});

test("feature list: clicking expand icon again hides feature details", async ({ page }) => {
  const expandBtn = page.locator('[data-testid="feature-item-user-auth"]').getByRole("button", { name: "View details" });
  await expandBtn.click(); // open
  await expandBtn.click(); // close
  await expect(page.locator('[data-testid="feature-item-user-auth"]').getByText(/Estimated range/)).not.toBeVisible();
});

// ─── Advanced category ────────────────────────────────────────────────────────

test("feature list: Advanced category contains new features when expanded", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await expect(page.locator('[data-testid="feature-item-biometric-auth"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-video-audio-streaming"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-dark-mode"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-accessibility"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-ar-camera"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-email-marketing"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-multi-tenant"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-webhooks-api"]')).toBeVisible();
  await expect(page.locator('[data-testid="feature-item-data-import-export"]')).toBeVisible();
});

// ─── Custom features ──────────────────────────────────────────────────────────

test("custom feature: clicking 'Add a custom feature' opens the form", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await page.getByRole("button", { name: /Add a custom feature/ }).click();
  await expect(page.getByPlaceholder(/Custom AI Chatbot/)).toBeVisible();
});

test("custom feature: adding a Small feature creates it in the list", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await page.getByRole("button", { name: /Add a custom feature/ }).click();
  const input = page.getByPlaceholder(/Custom AI Chatbot/);
  await expect(input).toBeVisible();
  await input.fill("My Small Feature");
  await page.getByRole("button", { name: /Small/ }).click();
  await page.locator('[data-testid="category-group-advanced"]')
    .getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("My Small Feature")).toBeVisible();
});

test("custom feature: adding a Medium feature creates it in the list", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await page.getByRole("button", { name: /Add a custom feature/ }).click();
  const input = page.getByPlaceholder(/Custom AI Chatbot/);
  await expect(input).toBeVisible();
  await input.fill("My Medium Feature");
  // Medium is the default size — just add
  await page.locator('[data-testid="category-group-advanced"]')
    .getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("My Medium Feature")).toBeVisible();
});

test("custom feature: adding a Large feature creates it in the list", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await page.getByRole("button", { name: /Add a custom feature/ }).click();
  const input = page.getByPlaceholder(/Custom AI Chatbot/);
  await expect(input).toBeVisible();
  await input.fill("My Large Feature");
  await page.getByRole("button", { name: /Large/ }).click();
  await page.locator('[data-testid="category-group-advanced"]')
    .getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("My Large Feature")).toBeVisible();
});

test("custom feature: Add button is disabled when name is empty", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await page.getByRole("button", { name: /Add a custom feature/ }).click();
  // Wait for form to fully animate in, then verify Add is disabled
  await expect(page.getByPlaceholder(/Custom AI Chatbot/)).toBeVisible();
  await expect(
    page.locator('[data-testid="category-group-advanced"]')
      .getByRole("button", { name: "Add", exact: true })
  ).toBeDisabled();
});

test("custom feature: Cancel closes the form without adding", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await page.getByRole("button", { name: /Add a custom feature/ }).click();
  const input = page.getByPlaceholder(/Custom AI Chatbot/);
  await expect(input).toBeVisible();
  await input.fill("Throwaway");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("Throwaway")).not.toBeVisible();
});

test("custom feature: deleting a custom feature removes it", async ({ page }) => {
  await clickCategoryHeader(page, "advanced");
  await page.getByRole("button", { name: /Add a custom feature/ }).click();
  const input = page.getByPlaceholder(/Custom AI Chatbot/);
  await expect(input).toBeVisible();
  await input.fill("Delete Me");
  await page.locator('[data-testid="category-group-advanced"]')
    .getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("Delete Me")).toBeVisible();

  await page.getByRole("button", { name: "Remove custom feature" }).click();
  await expect(page.getByText("Delete Me")).not.toBeVisible();
});
