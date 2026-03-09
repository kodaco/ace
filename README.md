# ace: The App Cost Estimator

A free, privacy-first web tool that helps entrepreneurs, product owners, and developers estimate the cost and timeline of building a software application.

Users select the features they want, optionally apply an AI development discount, enter an hourly rate (or choose a local service provider), and receive a detailed cost estimate broken down by development and annual maintenance.

**Live features:**
- Feature selection with per-feature hour ranges
- Low / Midpoint / High cost toggle
- Build with AI toggle (25% time reduction)
- Service provider directory with pre-loaded hourly rates
- Shareable estimate via email
- FAQ, "Before You Build" gotchas, privacy policy, terms of service, and references pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | MUI v7 (Material UI) |
| Language | TypeScript |
| Testing | Jest 30 + React Testing Library |
| Styling | Emotion (via MUI) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn

### Install dependencies

```bash
yarn install
```

### Set up git hooks

```bash
git config core.hooksPath .githooks
```

This enables the pre-commit and pre-push hooks described below.

### Run the dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
yarn build
yarn start
```

---

## Testing

Tests are located in the top-level `tests/` directory and mirror the `src/` structure.

```bash
# Run all tests with coverage (default)
yarn test

# Run without coverage
yarn test:nocoverage

# Watch mode
yarn test:watch
```

Coverage is enforced at **100%** across all source files. The pre-commit hook will block commits if any tests fail or coverage drops below the threshold.

---

## Git Hooks

### Pre-commit

Runs automatically before each commit:

1. **Lint** — ESLint must pass with no errors
2. **Tests + Coverage** — All tests must pass and coverage must remain at 100%

### Pre-push

Runs automatically before pushing to a remote:

1. **Build** — The Next.js production build must succeed

If either hook fails, the operation is aborted. Fix the issue and retry.

---

## How AI Affects Development Estimates

When the "Build with AI" toggle is enabled, all feature hour estimates are reduced by **25%** (multiplied by 0.75). This reflects industry observations that AI-assisted development (using tools like GitHub Copilot, Cursor, or similar) can meaningfully reduce implementation time for typical web application features.

**What this accounts for:**
- Faster boilerplate and scaffolding generation
- Accelerated debugging and code review cycles
- Quicker implementation of well-defined, patterned features

**What it does not account for:**
- Novel problem-solving and architecture decisions
- Integration complexity and debugging distributed systems
- Product discovery, design, and stakeholder alignment

The 25% reduction is an estimate — actual savings vary by team, tooling, and feature complexity. Maintenance cost estimates are also reduced proportionally when AI is toggled on.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages and layouts
│   ├── AppHeader.tsx           # Site header with nav
│   ├── AppFooter.tsx           # Site footer
│   ├── AppHero.tsx             # Landing hero section
│   ├── HowItWorks.tsx          # Explainer section
│   ├── _components/            # Shared UI components (BackLink, ModalPage)
│   ├── _content/               # Static page content (FAQ, Privacy, Terms, etc.)
│   ├── providers/              # Service provider directory page
│   └── [gotchas|faq|about|...] # Static content pages
├── features/
│   └── core/
│       ├── components/         # Feature components (CostEstimator, EstimateResults, etc.)
│       ├── data/               # Predefined features and providers data
│       ├── models/             # TypeScript types
│       └── services/           # Business logic (estimate calculator, email)
tests/                          # Jest test suites (mirrors src/ structure)
.githooks/                      # Git hooks (pre-commit, pre-push)
```

---

## License

MIT
