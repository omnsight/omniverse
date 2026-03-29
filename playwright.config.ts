
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5174',
  },
});
