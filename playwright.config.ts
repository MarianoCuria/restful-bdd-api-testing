import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: 'https://automationintesting.online',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      ...defineBddProject({
        name: 'bdd-ui',
        features: [
          'features/booking/**/*.feature',
          'features/availability/**/*.feature',
          'features/contact/**/*.feature',
        ],
        steps: [
          'steps/booking.steps.ts',
          'steps/availability.steps.ts',
          'steps/contact.steps.ts',
          'support/fixtures.ts',
        ],
      }),
      use: { ...devices['Desktop Chrome'] },
      retries: process.env.CI ? 2 : 0,
    },
    {
      ...defineBddProject({
        name: 'bdd-e2e',
        features: 'features/e2e/**/*.feature',
        steps: ['steps/e2e/e2e.steps.ts', 'support/e2e-fixtures.ts'],
      }),
      use: { ...devices['Desktop Chrome'] },
      retries: process.env.CI ? 2 : 0,
    },
    {
      ...defineBddProject({
        name: 'bdd-api',
        features: 'features/api/**/*.feature',
        steps: ['steps/api/**/*.ts', 'support/api-fixtures.ts'],
      }),
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
    },
  ],
});
