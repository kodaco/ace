import { test, expect } from "@playwright/test";
import { goto, waitForApp } from "./helpers";

test.beforeEach(async ({ page }) => {
  await goto(page);
  await waitForApp(page);
});

// ─── Platform selector ────────────────────────────────────────────────────────

test("platform: Web App is selected by default", async ({ page }) => {
  const webBtn = page.locator('[data-testid="platform-web"]');
  await expect(webBtn).toHaveClass(/Mui-selected/);
});

test("platform: can select iOS", async ({ page }) => {
  await page.click('[data-testid="platform-ios"]');
  await expect(page.locator('[data-testid="platform-ios"]')).toHaveClass(/Mui-selected/);
  await expect(page.locator('[data-testid="platform-web"]')).not.toHaveClass(/Mui-selected/);
});

test("platform: can select Android", async ({ page }) => {
  await page.click('[data-testid="platform-android"]');
  await expect(page.locator('[data-testid="platform-android"]')).toHaveClass(/Mui-selected/);
});

test("platform: cross-platform shows multiplier note", async ({ page }) => {
  await page.click('[data-testid="platform-cross-platform"]');
  await expect(page.locator('[data-testid="platform-cross-platform"]')).toHaveClass(/Mui-selected/);
  await expect(page.getByText(/adds ~35% to your estimated build time/)).toBeVisible();
});

test("platform: clicking the active platform button keeps it selected", async ({ page }) => {
  // Web App is the default — clicking it again should not deselect
  await page.click('[data-testid="platform-web"]');
  await expect(page.locator('[data-testid="platform-web"]')).toHaveClass(/Mui-selected/);
});

// ─── Preset interactions ──────────────────────────────────────────────────────

test("preset: Mobile App can be selected on iOS platform", async ({ page }) => {
  await page.click('[data-testid="platform-ios"]');
  const chip = page.locator('[data-testid="preset-mobile-app"] .MuiChip-root');
  await expect(chip).not.toHaveClass(/Mui-disabled/);
  await chip.click();
  await expect(chip).toHaveClass(/MuiChip-colorPrimary/);
});

test("preset: clicking active preset deselects it", async ({ page }) => {
  await page.click('[data-testid="platform-ios"]');
  const chip = page.locator('[data-testid="preset-mobile-app"] .MuiChip-root');
  await chip.click(); // select
  await expect(chip).toHaveClass(/MuiChip-colorPrimary/);
  await chip.click(); // deselect
  await expect(chip).not.toHaveClass(/MuiChip-colorPrimary/);
});

test("preset: SaaS / Web App can be selected on Web App platform", async ({ page }) => {
  const chip = page.locator('[data-testid="preset-saas-web"] .MuiChip-root');
  await expect(chip).not.toHaveClass(/Mui-disabled/);
  await chip.click();
  await expect(chip).toHaveClass(/MuiChip-colorPrimary/);
});

test("preset: E-commerce available on all platforms", async ({ page }) => {
  for (const platform of ["web", "ios", "android", "cross-platform"]) {
    await page.click(`[data-testid="platform-${platform}"]`);
    const chip = page.locator('[data-testid="preset-ecommerce"] .MuiChip-root');
    await expect(chip).not.toHaveClass(/Mui-disabled/);
  }
});

test("preset: Marketplace available on all platforms", async ({ page }) => {
  for (const platform of ["web", "ios", "android", "cross-platform"]) {
    await page.click(`[data-testid="platform-${platform}"]`);
    const chip = page.locator('[data-testid="preset-marketplace"] .MuiChip-root');
    await expect(chip).not.toHaveClass(/Mui-disabled/);
  }
});

// ─── Platform/preset incompatibility ─────────────────────────────────────────

test("incompatibility: Mobile App preset is disabled on Web App platform", async ({ page }) => {
  // Default platform is Web App
  const chip = page.locator('[data-testid="preset-mobile-app"] .MuiChip-root');
  await expect(chip).toHaveClass(/Mui-disabled/);
});

test("incompatibility: SaaS / Web App preset is disabled on iOS", async ({ page }) => {
  await page.click('[data-testid="platform-ios"]');
  const chip = page.locator('[data-testid="preset-saas-web"] .MuiChip-root');
  await expect(chip).toHaveClass(/Mui-disabled/);
});

test("incompatibility: SaaS / Web App preset is disabled on Android", async ({ page }) => {
  await page.click('[data-testid="platform-android"]');
  const chip = page.locator('[data-testid="preset-saas-web"] .MuiChip-root');
  await expect(chip).toHaveClass(/Mui-disabled/);
});

test("incompatibility: Mobile App tooltip appears on hover when disabled", async ({ page }) => {
  // Hover the disabled chip wrapper
  await page.hover('[data-testid="preset-mobile-app"]');
  await expect(page.getByRole("tooltip")).toContainText(/Mobile App targets native platforms/i);
});

test("incompatibility: all presets enabled on Cross-platform", async ({ page }) => {
  await page.click('[data-testid="platform-cross-platform"]');
  for (const id of ["mobile-app", "saas-web", "ecommerce", "marketplace", "portfolio"]) {
    const chip = page.locator(`[data-testid="preset-${id}"] .MuiChip-root`);
    await expect(chip).not.toHaveClass(/Mui-disabled/);
  }
});

test("incompatibility: active Mobile App preset auto-clears when switching to Web App", async ({ page }) => {
  // Start on iOS so Mobile App is available
  await page.click('[data-testid="platform-ios"]');
  const chip = page.locator('[data-testid="preset-mobile-app"] .MuiChip-root');
  await chip.click(); // activate preset
  await expect(chip).toHaveClass(/MuiChip-colorPrimary/);

  // Switch to Web App — Mobile App is incompatible → preset should auto-clear
  await page.click('[data-testid="platform-web"]');
  await expect(chip).not.toHaveClass(/MuiChip-colorPrimary/);
  await expect(chip).toHaveClass(/Mui-disabled/);
});

test("incompatibility: active SaaS preset auto-clears when switching to iOS", async ({ page }) => {
  // Web App: select SaaS preset
  const chip = page.locator('[data-testid="preset-saas-web"] .MuiChip-root');
  await chip.click();
  await expect(chip).toHaveClass(/MuiChip-colorPrimary/);

  // Switch to iOS — SaaS is incompatible → auto-clear
  await page.click('[data-testid="platform-ios"]');
  await expect(chip).not.toHaveClass(/MuiChip-colorPrimary/);
  await expect(chip).toHaveClass(/Mui-disabled/);
});
