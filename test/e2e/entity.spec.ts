import { test, expect } from '@playwright/test';
import type {
  Event,
  Organization,
  Person,
  Relation,
  Source,
  Website,
} from 'omni-osint-crud-client';

interface TestData {
  events: Event[];
  organizations: Organization[];
  people: Person[];
  relations: Relation[];
  sources: Source[];
  websites: Website[];
}

const testData: TestData = {
  events: [
    {
      title: 'Global Financial Summit',
      description: 'A summit discussing the future of global finance and fintech innovations.',
      location: {
        latitude: 37.53,
        longitude: -123.81,
        country_code: 'US',
        administrative_area: 'California',
        sub_administrative_area: 'San Francisco County',
        locality: 'San Francisco',
        sub_locality: 'San Francisco',
        address: '123 Main St',
        postal_code: 23817,
      },
    },
    {
      title: '亚洲数字艺术展',
      description: '展示亚洲各地新兴数字艺术家的作品。',
      location: {
        latitude: 38.10,
        longitude: -136.90,
        country_code: 'AS',
        administrative_area: 'Hawaii',
        sub_administrative_area: 'Oahu County',
        locality: 'Honolulu',
        sub_locality: 'Honolulu',
        address: '123 Honolulu St',
        postal_code: 93201,
      },
    },
    {
      title: '国际人工智能与机器人大会',
      description: '探讨人工智能和机器人技术的最新进展及其对社会的影响。',
      location: {
        latitude: 27.49,
        longitude: -127.10,
        country_code: 'HX',
        administrative_area: '深坑星区',
        sub_administrative_area: '红土块区',
        locality: '菠萝市',
        sub_locality: '菠萝大巴扎',
        address: '123 菠萝街道',
        postal_code: 38172,
      },
    },
  ],
  organizations: [
    {
      name: 'FutureScape AI',
    },
    { name: '绿色和平组织' },
  ],
  people: [
    {
      name: 'Dr. Evelyn Reed',
      role: 'Senior Scientist',
    },
    { name: '王伟' },
  ],
  relations: [
    { name: 'founded', label: 'Founded', confidence: 10 },
    { name: 'invested', label: '投资', confidence: 50 },
  ],
  sources: [
    { name: 'Bloomberg', url: 'https://www.bloomberg.com' },
    { name: '财新网', url: 'https://www.caixin.com' },
  ],
  websites: [
    {
      title: 'FutureScape AI Official Site',
      description: 'FutureScape AI的官方网站',
      url: 'https://futurescape-ai.com',
    },
    { title: '财新网主页', description: '财新网的官方网站', url: 'https://www.caixin.com' },
  ],
};

test.describe('Entity Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Escape');
    await page.waitForLoadState('networkidle');
  });

  // TODO: Implement tests for other entity types

  for (const event of testData.events) {
    test(`should create an event titled "${event.title}"`, async ({ page }) => {
      // Right-click on the graph to open the context menu
      await page.locator('.react-flow__pane').click({ button: 'right' });

      // Click the "Create" button in the context menu
      await page.locator('div[role="menuitem"]', { hasText: 'Create' }).click();

      // Select "Event" from the entity type dropdown
      await page.locator('input[placeholder="Select type"]').click();
      await page.locator('div[role="option"]', { hasText: 'Event' }).click();

      // Fill out the form
      const titleInput = page.locator('input[placeholder*="Title"]');
      const descriptionInput = page.locator('textarea[placeholder*="Description"]');
      const createButton = page.locator('button', { hasText: 'Create' });

      await titleInput.fill(event.title || '');
      await descriptionInput.fill(event.description || '');

      await createButton.click();

      // Assert that the new entity appears in the graph
      await expect(page.locator('.react-flow__node', { hasText: event.title || '' })).toBeVisible();
    });
  }

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = testInfo.outputPath(`failure.png`);
      testInfo.attachments.push({
        name: 'screenshot',
        path: screenshotPath,
        contentType: 'image/png',
      });
      await page.screenshot({ path: screenshotPath, timeout: 5000 });
    }
  });
});
