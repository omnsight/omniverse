import { test, expect } from '@playwright/test';
import type { MonitoringSource } from 'omni-monitoring-client';

const monitoringSources: MonitoringSource[] = [
  {
    name: 'Tech News Daily',
    description: 'A reliable source for daily technology news and analysis.',
    type: 'website',
    url: 'https://technewsdaily.com',
    owner: '',
  },
  {
    name: '全球经济观察',
    description: '提供关于全球宏观经济趋势的深度报道和分析。 ',
    type: 'twitter',
    url: 'https://twitter.com/globaleconwatch',
    owner: '',
  },
];

test.describe('Monitoring Source Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/monitor');
    await page.keyboard.press('Escape');
    await page.waitForLoadState('networkidle');
  });

  for (const source of monitoringSources) {
    test(`should create a monitoring source named "${source.name}"`, async ({ page }) => {
      // Click the "Create Monitoring Source" button
      await page.locator('button', { hasText: /create/i }).click();

      // Fill out the form
      const modal = page.locator('div[role="dialog"]');
      const nameInput = modal.locator('input[placeholder*="Name"]');
      const descriptionInput = modal.locator('textarea[placeholder*="Description"]');
      const typeSelect = modal.locator('input[placeholder*="Type"]');
      const urlInput = modal.locator('input[placeholder*="URL"]');
      const createButton = modal.locator('button', { hasText: 'Create' });

      await nameInput.fill(source.name || '');
      await descriptionInput.fill(source.description || '');
      await typeSelect.click();
      await page.locator('div[role="option"]', { hasText: source.type || '' }).click();
      await urlInput.fill(source.url || '');

      await createButton.click();

      // Assert that the new source appears in the list
      await expect(page.locator('div', { hasText: source.name || '' })).toBeVisible();
    });
  }

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = testInfo.outputPath(`failure.png`);
      testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
      await page.screenshot({ path: screenshotPath, timeout: 5000 });
    }
  });
});
