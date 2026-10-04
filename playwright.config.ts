import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 4,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npx serve landing-page -l 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
