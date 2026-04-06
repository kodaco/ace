# ace — Improvements & Enhancements Roadmap
_Planned and implemented: 2026-03-29_

## Branch

All changes implemented on branch: `feature/enhancements`

## Context

ace is a fully functional, client-side app cost estimator hosted on GitHub static pages. The core calculator is solid. This plan added meaningful improvements across three areas — UX/presentation, calculator enhancements, and new features — ordered by impact-to-effort ratio. Features requiring a server (email sending, Providers page) are deferred.

---

## Tier 1 — Quick Wins

### 1. URL-Based Shareable Estimate Links ✅
**What:** Encode the current calculator state (selected feature IDs, hourly rate, AI toggle) into the URL hash. Anyone visiting the link gets the same pre-configured estimate.

**Implementation:**
- Serialize `{ features: string[], rate: number, ai: boolean }` to a compact base64 URL param (`/?e=<encoded>`)
- On mount in `CostEstimator.tsx`, read and decode the param to hydrate state
- Add a "Copy Link" button to `EstimateResults`

**Files changed:**
- `src/features/core/components/CostEstimator.tsx`
- `src/features/core/components/EstimateResults.tsx`
- New: `src/features/core/services/estimate-url.ts`

---

### 2. Project Type Presets ✅
**What:** Add a "Start with a preset" section above the feature list with 5 preset buttons. Each preset pre-selects the most relevant features.

**Presets:**
- Mobile App (Accounts, Profiles, Push Notifications, Onboarding, File Uploads)
- SaaS / Web App (Accounts, Admin Dashboard, Analytics, Subscriptions, Search)
- E-commerce (Payments, Product Catalog, Search, Reviews, Analytics)
- Marketplace (Accounts, Payments, Booking/Scheduling, Reviews, In-App Messaging)
- Portfolio / Marketing Site (Onboarding only)

**Files changed:**
- New: `src/features/core/data/presets.ts`
- New: `src/features/core/components/ProjectPresets.tsx`
- `src/features/core/components/CostEstimator.tsx`

---

### 3. Print / Save as PDF ✅
**What:** "Save as PDF" button in `EstimateResults` triggers `window.print()` with `@media print` CSS that hides nav/footer and shows only the estimate.

**Files changed:**
- `src/features/core/components/EstimateResults.tsx`
- `src/app/globals.css`

---

## Tier 2 — Calculator Enhancements

### 4. Collapsible Category Groups for Feature List ✅
**What:** Reorganize the feature list from a flat list into collapsible accordion sections with a selected-count badge on each header.

**Categories:**
| Category | Features |
|---|---|
| Core | UI/UX Design *(always active)*, User Accounts & Login, User Profiles, Onboarding Flow |
| Communication & Engagement | Push Notifications, In-App Messaging, Social Sharing, Reviews & Ratings |
| Commerce & Monetization | Payments & Checkout, Product Catalog & Shopping Cart, Subscriptions & Memberships, Booking & Scheduling |
| Data & Intelligence | Search, Analytics & Reporting, Third-party Integrations, Multi-language Support |
| Platform & Infrastructure | File Uploads, Geolocation Services, QR & Barcode Scanning, Offline Mode |
| Advanced | 9 new features + custom feature input |

**Files changed:**
- `src/features/core/models/app-feature.ts`
- `src/features/core/data/predefined-features.ts`
- `src/features/core/components/FeatureList.tsx`
- New: `src/features/core/components/FeatureCategoryGroup.tsx`

---

### 5. Expand the Feature Catalog (Advanced Category) ✅
**What:** Added 9 new features to the "Advanced" category.

| Feature | Min Hrs | Max Hrs |
|---|---|---|
| Biometric / Face ID Auth | 20 | 60 |
| Video & Audio Streaming | 80 | 200 |
| Dark Mode / Theming | 20 | 50 |
| Accessibility (WCAG Compliance) | 30 | 80 |
| AR / Camera Features | 60 | 200 |
| Email Marketing Integration | 20 | 60 |
| Multi-tenant / White-label Support | 80 | 250 |
| Webhooks & API Access | 40 | 120 |
| Data Import / Export | 30 | 80 |

**Files changed:**
- `src/features/core/data/predefined-features.ts`

---

### 6. Custom Feature Input ✅
**What:** "Add a custom feature" form at the bottom of the Advanced category. Users name a feature and pick Small/Medium/Large size. Custom features are deletable and always selected.

**Files changed:**
- `src/features/core/components/CostEstimator.tsx`
- `src/features/core/components/FeatureList.tsx`
- `src/features/core/components/FeatureCategoryGroup.tsx`
- `src/features/core/components/FeatureListItem.tsx`
- New: `src/features/core/components/CustomFeatureInput.tsx`

---

### 7. Platform Selector ✅
**What:** Toggle between Web App / iOS / Android / Cross-platform. Cross-platform applies a ×1.35 multiplier to all hour estimates.

**Files changed:**
- `src/features/core/services/estimate-calculator.ts`
- `src/features/core/components/CostEstimator.tsx`
- New: `src/features/core/components/PlatformSelector.tsx`

---

### 8. Currency Selector ✅
**What:** Dropdown (USD, EUR, GBP, CAD, AUD) in the hourly rate card. All costs convert using static exchange rates.

**Files changed:**
- New: `src/features/core/data/currencies.ts`
- `src/features/core/components/HourlyRateInput.tsx`
- `src/features/core/components/EstimateResults.tsx`
- `src/features/core/components/CostEstimator.tsx`

---

## Tier 3 — New Features

### 9. Cost Breakdown Chart ✅
**What:** Inside "View cost range & details", a horizontal bar chart shows each feature's share of total hours, sorted descending. No chart library — pure MUI `Box` components.

**Files changed:**
- `src/features/core/components/EstimateResults.tsx`

---

### 10. Compare Two Estimates ✅
**What:** "Compare two estimates" toggle above the calculator renders two independent `CostEstimator` instances side by side, each labeled "Estimate A" / "Estimate B".

**Files changed:**
- `src/app/page.tsx`
- `src/features/core/components/CostEstimator.tsx`
- New: `src/app/CalculatorSection.tsx`

---

### 11. Save & Load Estimates (Local Storage) ✅
**What:** "Save estimate" button in results opens a name input. Up to 5 estimates saved in `localStorage`. A "Saved (N)" button opens a slide-out drawer to restore or delete saved estimates.

**Files changed:**
- New: `src/features/core/services/estimate-storage.ts`
- New: `src/features/core/components/SavedEstimatesDrawer.tsx`
- `src/features/core/components/EstimateResults.tsx`
- `src/features/core/components/CostEstimator.tsx`

---

## New Files Summary

| File | Purpose |
|---|---|
| `src/features/core/services/estimate-url.ts` | Base64 encode/decode calculator state for URL sharing |
| `src/features/core/services/estimate-storage.ts` | localStorage read/write/delete for saved estimates |
| `src/features/core/data/presets.ts` | Preset definitions (Mobile App, SaaS, E-commerce, etc.) |
| `src/features/core/data/currencies.ts` | Currency list with static USD exchange rates |
| `src/features/core/components/ProjectPresets.tsx` | Preset chip selector UI |
| `src/features/core/components/FeatureCategoryGroup.tsx` | Collapsible category accordion with badge |
| `src/features/core/components/CustomFeatureInput.tsx` | Add/name custom features form |
| `src/features/core/components/PlatformSelector.tsx` | Web / iOS / Android / Cross-platform toggle |
| `src/features/core/components/SavedEstimatesDrawer.tsx` | Slide-out drawer listing saved estimates |
| `src/app/CalculatorSection.tsx` | Client wrapper for compare mode toggle |
