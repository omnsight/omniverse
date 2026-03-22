
import { test, expect } from '@playwright/test';

test.describe('Insight Creation', () => {
  test('should create a new insight', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('http://localhost:5174');

    await page.keyboard.press('Escape');

    await page.waitForLoadState('networkidle');

    // 2. Click the "Add Insight" button
    // The button is a full-width button with a PlusIcon inside.
    const addInsightButton = page.getByTestId('add-insight-button');
    await addInsightButton.click({ timeout: 10000 });

    // 3. Fill out the form
    // Wait for the modal to appear. We will look for any dialog that appears.
    await page.waitForTimeout(1000); // Small delay to wait for animations
    const modal = page.locator('div[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    const titleInput = modal.locator('input[type="text"]');
    const descriptionInput = modal.locator('textarea');
    const createButton = modal.locator('button', { hasText: 'Create' });

    await titleInput.fill('E2E Test Insight');
    await descriptionInput.fill('This is an insight created from an E2E test.');

    // 4. Submit the form
    await createButton.click();

    // 5. Assert the new insight is created
    await expect(page.locator('div', { hasText: 'E2E Test Insight' })).toBeVisible();
    await expect(page.locator('div', { hasText: 'This is an insight created from an E2E test.' })).toBeVisible();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      // Get a unique path for the screenshot.
      const screenshotPath = testInfo.outputPath(`failure.png`);
      // Add it to the report.
      testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
      // Take the screenshot itself.
      await page.screenshot({ path: screenshotPath, timeout: 5000 });
    }
  });
});
