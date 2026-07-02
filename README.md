# restful-bdd-api-testing

A portfolio project combining **BDD with Playwright** and **API testing with Allure reporting**, targeting [Restful Booker](https://restful-booker.herokuapp.com/) — a public hotel booking demo with both a UI and a REST API.

---

## What this project demonstrates

| Layer | Approach | Target |
|-------|----------|--------|
| **BDD / UI** | `playwright-bdd` — Gherkin `.feature` files + Playwright step definitions | Hotel booking UI (`automationintesting.online`) |
| **API** | Playwright `request` context — full CRUD coverage with typed API client | Restful Booker REST API |
| **Reporting** | Allure — rich HTML reports with steps, attachments and history | Both layers |
| **CI** | GitHub Actions — parallel API and BDD jobs, Allure report as artifact | Push / PR / manual dispatch |

---

## Project structure

```
restful-bdd-api-testing/
├── features/                  # Gherkin .feature files (business language)
│   └── booking/
│       └── create-booking.feature
├── steps/                     # Step definitions (Playwright implementation)
│   └── booking.steps.ts
├── pages/                     # Page Object Model
│   └── BookingPage.ts
├── support/                   # Shared fixtures (extend playwright-bdd test)
│   └── fixtures.ts
├── tests/
│   └── api/                   # Pure API test specs
│       └── booking.api.spec.ts
├── helpers/
│   └── api-client.ts          # Typed HTTP wrapper (keeps specs clean)
├── playwright.config.ts
├── .github/workflows/tests.yml
└── package.json
```

---

## Key design decisions

**Why `playwright-bdd` over `@cucumber/cucumber`?**
`playwright-bdd` runs through Playwright Test, giving access to the same fixtures, tracing, and screenshot capabilities as the rest of the suite — without managing two separate runners. BDD syntax stays 100% standard Gherkin.

**Why a typed `BookingApiClient` wrapper?**
Keeping HTTP details (headers, base paths, response parsing) out of the test files means each spec reads as a narrative of what's being validated, not how the HTTP call is constructed. When the API changes, you fix one file.

**Why separate CI jobs for API and BDD?**
API tests are fast (~4s) and should fail fast. BDD UI tests are slower and need a browser. Running them in parallel shortens total CI time and makes failures easier to isolate.

---

## Running locally

```bash
# Install dependencies
npm ci

# Install Playwright browser (first time)
npx playwright install chromium

# API tests only (fast, no browser needed)
npm run test:api

# BDD UI tests
npm run test:bdd

# Both
npm run test:all

# Open Allure report after any run
npm run allure:report
```

---

## CI

Workflow: [`.github/workflows/tests.yml`](.github/workflows/tests.yml)

- Triggers on push/PR to `main` and manual dispatch.
- Two parallel jobs: `api` and `bdd-ui`.
- Allure reports uploaded as artifacts (30-day retention).
