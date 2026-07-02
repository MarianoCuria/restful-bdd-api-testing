import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// BDD config: tells playwright-bdd where to find .feature files and step definitions.
const bddConfig = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'support/fixtures.ts'],
});

export default defineConfig({
  testDir: bddConfig.outputDir,
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
      name: 'bdd-ui',
      testDir: bddConfig.outputDir,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: 'tests/api',
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
    },
  ],
});
